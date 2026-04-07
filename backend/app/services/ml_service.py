from __future__ import annotations

from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

import joblib
import networkx as nx
import numpy as np
import pandas as pd
from sklearn.cluster import DBSCAN
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

from app.models.fir import FIRRecord

MODEL_DIR = Path(__file__).resolve().parent.parent / "ml"
MODEL_PATH = MODEL_DIR / "crime_predictor.joblib"
CLASSIFICATION_MODEL_PATH = MODEL_DIR / "crime_classifier.joblib"


@dataclass
class ModelBundle:
    pipeline: Pipeline


class CrimeModelService:
    def __init__(self) -> None:
        self.model_bundle: ModelBundle | None = None
        self.classifier_bundle: ModelBundle | None = None
        MODEL_DIR.mkdir(parents=True, exist_ok=True)
        if MODEL_PATH.exists():
            self.model_bundle = ModelBundle(joblib.load(MODEL_PATH))
        if CLASSIFICATION_MODEL_PATH.exists():
            self.classifier_bundle = ModelBundle(joblib.load(CLASSIFICATION_MODEL_PATH))

    @staticmethod
    def to_dataframe(records: list[FIRRecord]) -> pd.DataFrame:
        rows = [
            {
                "crime_type": r.crime_type,
                "crime_code": r.crime_code,
                "description": r.description,
                "hour": r.occurred_at.hour,
                "month": r.occurred_at.month,
                "station": r.police_station,
                "lat": r.latitude,
                "lon": r.longitude,
                "severity": r.severity,
                "target_high_risk": 1 if r.severity >= 4 or r.is_women_related else 0,
            }
            for r in records
        ]
        return pd.DataFrame(rows)

    def train(self, records: list[FIRRecord]) -> bool:
        if len(records) < 50:
            return False
        df = self.to_dataframe(records)
        X = df[["crime_type", "crime_code", "hour", "month", "station", "lat", "lon", "severity"]]
        y = df["target_high_risk"]

        preprocessor = ColumnTransformer(
            transformers=[
                (
                    "cat",
                    OneHotEncoder(handle_unknown="ignore"),
                    ["crime_type", "crime_code", "station"],
                ),
            ],
            remainder="passthrough",
        )

        model = RandomForestClassifier(
            n_estimators=200,
            random_state=42,
            class_weight="balanced",
            max_depth=14,
        )

        pipeline = Pipeline([
            ("pre", preprocessor),
            ("clf", model),
        ])
        pipeline.fit(X, y)

        self.model_bundle = ModelBundle(pipeline)
        joblib.dump(pipeline, MODEL_PATH)
        self._train_classifier(df)
        return True

    def _train_classifier(self, df: pd.DataFrame) -> None:
        if df["crime_type"].nunique() < 2:
            return

        preprocessor = ColumnTransformer(
            transformers=[
                ("text", TfidfVectorizer(max_features=800), "description"),
                ("code", OneHotEncoder(handle_unknown="ignore"), ["crime_code"]),
            ]
        )
        classifier = LogisticRegression(max_iter=1000)
        pipeline = Pipeline([("pre", preprocessor), ("clf", classifier)])
        pipeline.fit(df[["description", "crime_code"]], df["crime_type"])
        self.classifier_bundle = ModelBundle(pipeline)
        joblib.dump(pipeline, CLASSIFICATION_MODEL_PATH)

    def predict_risk(self, payload: dict) -> float:
        if not self.model_bundle:
            return 0.5
        row = pd.DataFrame([payload])
        probability = self.model_bundle.pipeline.predict_proba(row)[0][1]
        return float(probability)

    def classify_crime(self, crime_code: str, description: str) -> dict:
        if not self.classifier_bundle:
            return {"crime_type": "IPC-Theft", "confidence": 0.5}

        row = pd.DataFrame([{"crime_code": crime_code, "description": description or "unknown"}])
        prediction = self.classifier_bundle.pipeline.predict(row)[0]
        probabilities = self.classifier_bundle.pipeline.predict_proba(row)[0]
        confidence = float(np.max(probabilities))
        return {"crime_type": str(prediction), "confidence": round(confidence, 4)}

    @staticmethod
    def build_hotspots(records: list[FIRRecord]) -> list[dict]:
        # Cell-based aggregation for map-friendly hotspot rendering.
        cell_counts: dict[tuple[float, float], dict] = {}
        for r in records:
            cell_lat = round(r.latitude, 3)
            cell_lon = round(r.longitude, 3)
            key = (cell_lat, cell_lon)
            if key not in cell_counts:
                cell_counts[key] = {"count": 0, "severity_sum": 0}
            cell_counts[key]["count"] += 1
            cell_counts[key]["severity_sum"] += r.severity

        hotspots: list[dict] = []
        for (lat, lon), stats in cell_counts.items():
            risk_score = (stats["count"] * 0.65) + (stats["severity_sum"] * 0.35)
            level = "high" if risk_score >= 18 else "medium" if risk_score >= 8 else "low"
            hotspots.append(
                {
                    "latitude": lat,
                    "longitude": lon,
                    "risk_score": round(risk_score, 2),
                    "level": level,
                    "count": stats["count"],
                }
            )
        return sorted(hotspots, key=lambda x: x["risk_score"], reverse=True)

    @staticmethod
    def behavioral_summary(records: list[FIRRecord]) -> dict:
        by_hour = Counter(str(r.occurred_at.hour) for r in records)
        by_month = Counter(str(r.occurred_at.month) for r in records)
        by_station = Counter(r.police_station for r in records)
        return {
            "by_hour": dict(by_hour),
            "by_month": dict(by_month),
            "by_station": dict(by_station),
        }

    @staticmethod
    def women_safety(records: list[FIRRecord]) -> list[dict]:
        grouped: dict[tuple[float, float], int] = defaultdict(int)
        for r in records:
            if r.is_women_related:
                grouped[(round(r.latitude, 3), round(r.longitude, 3))] += 1
        output = []
        for (lat, lon), count in grouped.items():
            label = "unsafe" if count >= 5 else "caution" if count >= 2 else "watch"
            output.append(
                {
                    "latitude": lat,
                    "longitude": lon,
                    "women_related_count": count,
                    "risk_label": label,
                }
            )
        return sorted(output, key=lambda x: x["women_related_count"], reverse=True)

    @staticmethod
    def accident_clusters(records: list[FIRRecord]) -> list[dict]:
        accident_points = [(r.latitude, r.longitude) for r in records if r.is_accident]
        if len(accident_points) < 5:
            return []

        coords = np.array(accident_points)
        clustering = DBSCAN(eps=0.01, min_samples=4).fit(coords)
        labels = clustering.labels_

        clusters: dict[int, list[np.ndarray]] = defaultdict(list)
        for idx, label in enumerate(labels):
            if label != -1:
                clusters[int(label)].append(coords[idx])

        output = []
        for points in clusters.values():
            arr = np.array(points)
            centroid = arr.mean(axis=0)
            output.append(
                {
                    "latitude": float(round(centroid[0], 5)),
                    "longitude": float(round(centroid[1], 5)),
                    "size": int(len(points)),
                }
            )
        return sorted(output, key=lambda x: x["size"], reverse=True)

    @staticmethod
    def patrol_route(hotspots: list[dict]) -> dict:
        if len(hotspots) < 2:
            return {"route": [], "risk_weight": 0.0}

        graph = nx.Graph()
        for i, node in enumerate(hotspots[:15]):
            graph.add_node(i, lat=node["latitude"], lon=node["longitude"], risk=node["risk_score"])

        nodes = list(graph.nodes(data=True))
        for i, data_i in nodes:
            for j, data_j in nodes:
                if i >= j:
                    continue
                distance = np.hypot(data_i["lat"] - data_j["lat"], data_i["lon"] - data_j["lon"])
                risk_weight = (data_i["risk"] + data_j["risk"]) / 2
                # Lower edge cost for high-risk areas to prioritize patrol path through them.
                cost = max(distance - (risk_weight * 0.001), 0.0001)
                graph.add_edge(i, j, weight=cost)

        start, end = 0, min(5, len(graph.nodes) - 1)
        path = nx.astar_path(graph, start, end, weight="weight")
        route = [{"latitude": graph.nodes[n]["lat"], "longitude": graph.nodes[n]["lon"]} for n in path]
        risk = float(sum(graph.nodes[n]["risk"] for n in path))
        return {"route": route, "risk_weight": round(risk, 2)}


crime_model_service = CrimeModelService()


def build_prediction_features(record: FIRRecord | dict) -> dict:
    if isinstance(record, dict):
        occurred = datetime.fromisoformat(record["occurred_at"]) if isinstance(record["occurred_at"], str) else record["occurred_at"]
        return {
            "crime_type": record["crime_type"],
            "crime_code": record["crime_code"],
            "hour": occurred.hour,
            "month": occurred.month,
            "station": record["police_station"],
            "lat": record["latitude"],
            "lon": record["longitude"],
            "severity": record.get("severity", 1),
        }

    return {
        "crime_type": record.crime_type,
        "crime_code": record.crime_code,
        "hour": record.occurred_at.hour,
        "month": record.occurred_at.month,
        "station": record.police_station,
        "lat": record.latitude,
        "lon": record.longitude,
        "severity": record.severity,
    }
