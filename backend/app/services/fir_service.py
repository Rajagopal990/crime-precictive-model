import csv
import io
import json
from datetime import datetime

import numpy as np
import pandas as pd
from PIL import Image
from sqlalchemy.orm import Session

from app.models.fir import FIRRecord
from app.schemas.fir import FIRCreate

TIME_SLOT_RANGES = {
    "morning": range(6, 12),
    "afternoon": range(12, 17),
    "evening": range(17, 21),
    "night": range(21, 24),
    "late-night": range(0, 6),
}

REQUIRED_COLUMNS = {
    "crime_code",
    "crime_type",
    "occurred_at",
    "latitude",
    "longitude",
    "address",
    "description",
    "police_station",
}


class MiniCNNFeatureExtractor:
    """Tiny CNN-like feature extractor used for image quality/document confidence."""

    def __init__(self) -> None:
        self.kernels = [
            np.array([[1, 0, -1], [2, 0, -2], [1, 0, -1]], dtype=np.float32),
            np.array([[1, 2, 1], [0, 0, 0], [-1, -2, -1]], dtype=np.float32),
            np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]], dtype=np.float32),
        ]

    @staticmethod
    def _conv2d(image: np.ndarray, kernel: np.ndarray) -> np.ndarray:
        h, w = image.shape
        kh, kw = kernel.shape
        pad_h, pad_w = kh // 2, kw // 2
        padded = np.pad(image, ((pad_h, pad_h), (pad_w, pad_w)), mode="edge")
        out = np.zeros_like(image, dtype=np.float32)

        for i in range(h):
            for j in range(w):
                window = padded[i : i + kh, j : j + kw]
                out[i, j] = np.sum(window * kernel)

        return np.maximum(out, 0)

    def analyze(self, image_bytes: bytes) -> dict:
        image = Image.open(io.BytesIO(image_bytes)).convert("L").resize((128, 128))
        arr = np.asarray(image, dtype=np.float32) / 255.0

        features = []
        for kernel in self.kernels:
            fmap = self._conv2d(arr, kernel)
            pooled = fmap.reshape(64, 2, 64, 2).mean(axis=(1, 3))
            features.append(float(pooled.mean()))

        edge_score = float(np.mean(features))
        document_confidence = round(min(max(edge_score * 3.2, 0.0), 1.0), 4)
        return {
            "cnn_model": "mini-cnn-v1",
            "document_confidence": document_confidence,
            "feature_vector": [round(v, 5) for v in features],
        }


def create_fir(db: Session, payload: FIRCreate) -> FIRRecord:
    record = FIRRecord(**payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def _matches_time_slot(occurred_at: datetime, time_slot: str | None) -> bool:
    if not time_slot:
        return True
    hours = TIME_SLOT_RANGES.get(time_slot)
    if not hours:
        return True
    return occurred_at.hour in hours


def list_firs(
    db: Session,
    crime_type: str | None = None,
    police_station: str | None = None,
    from_date: datetime | None = None,
    to_date: datetime | None = None,
    time_slot: str | None = None,
) -> list[FIRRecord]:
    query = db.query(FIRRecord)
    if crime_type:
        query = query.filter(FIRRecord.crime_type == crime_type)
    if police_station:
        query = query.filter(FIRRecord.police_station == police_station)
    if from_date:
        query = query.filter(FIRRecord.occurred_at >= from_date)
    if to_date:
        query = query.filter(FIRRecord.occurred_at <= to_date)

    records = query.order_by(FIRRecord.occurred_at.desc()).all()
    if time_slot:
        records = [record for record in records if _matches_time_slot(record.occurred_at, time_slot)]
    return records


def _to_bool(value) -> bool:
    return str(value).strip().lower() in {"1", "true", "yes", "y"}


def _normalize_row(row: dict) -> dict:
    normalized = {str(k).strip().lower(): v for k, v in row.items()}

    payload = {
        "crime_code": str(normalized.get("crime_code", "")).strip(),
        "crime_type": str(normalized.get("crime_type", "")).strip(),
        "occurred_at": normalized.get("occurred_at"),
        "latitude": float(normalized.get("latitude")),
        "longitude": float(normalized.get("longitude")),
        "address": str(normalized.get("address", "")).strip(),
        "description": str(normalized.get("description", "")).strip(),
        "police_station": str(normalized.get("police_station", "")).strip(),
        "severity": int(normalized.get("severity", 1) or 1),
        "is_accident": _to_bool(normalized.get("is_accident", False)),
        "is_women_related": _to_bool(normalized.get("is_women_related", False)),
    }

    occurred = payload["occurred_at"]
    if isinstance(occurred, str):
        payload["occurred_at"] = datetime.fromisoformat(occurred)

    return payload


def _ingest_rows(db: Session, rows: list[dict]) -> int:
    count = 0
    for row in rows:
        normalized = _normalize_row(row)
        validated = FIRCreate(**normalized)
        db.add(FIRRecord(**validated.model_dump()))
        count += 1
    db.commit()
    return count


def ingest_json(db: Session, payload: bytes) -> int:
    parsed = json.loads(payload.decode("utf-8"))
    rows = parsed if isinstance(parsed, list) else [parsed]
    return _ingest_rows(db, rows)


def ingest_csv(db: Session, payload: bytes) -> int:
    text = payload.decode("utf-8")
    reader = csv.DictReader(io.StringIO(text))
    rows = list(reader)
    return _ingest_rows(db, rows)


def ingest_excel(db: Session, payload: bytes) -> int:
    frame = pd.read_excel(io.BytesIO(payload))
    columns = {str(c).strip().lower() for c in frame.columns}
    if not REQUIRED_COLUMNS.issubset(columns):
        missing = sorted(REQUIRED_COLUMNS - columns)
        raise ValueError(f"Excel is missing required columns: {', '.join(missing)}")
    rows = frame.to_dict(orient="records")
    return _ingest_rows(db, rows)


def _parse_pdf_text_to_rows(text: str) -> list[dict]:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if not lines:
        return []

    header_idx = -1
    for idx, line in enumerate(lines):
        lower = line.lower()
        if all(col in lower for col in ("crime_code", "crime_type", "occurred_at", "latitude", "longitude")):
            header_idx = idx
            break

    if header_idx == -1:
        return []

    csv_text = "\n".join(lines[header_idx:])
    reader = csv.DictReader(io.StringIO(csv_text))
    return list(reader)


def ingest_pdf(db: Session, payload: bytes) -> int:
    try:
        from PyPDF2 import PdfReader
    except Exception as exc:
        raise ValueError("PDF support is unavailable. Install PyPDF2.") from exc

    reader = PdfReader(io.BytesIO(payload))
    text = "\n".join((page.extract_text() or "") for page in reader.pages)
    rows = _parse_pdf_text_to_rows(text)
    if not rows:
        raise ValueError(
            "Could not extract FIR rows from PDF. Use CSV/Excel with FIR columns or a text-based PDF table."
        )
    return _ingest_rows(db, rows)


def ingest_image_with_cnn(db: Session, payload: bytes) -> tuple[int, dict]:
    cnn_report = MiniCNNFeatureExtractor().analyze(payload)

    # Optional OCR path when pytesseract + system tesseract are available.
    try:
        import pytesseract

        image = Image.open(io.BytesIO(payload)).convert("RGB")
        text = pytesseract.image_to_string(image)
        rows = _parse_pdf_text_to_rows(text)
        if rows:
            inserted = _ingest_rows(db, rows)
            cnn_report["ocr_status"] = "success"
            return inserted, cnn_report
        cnn_report["ocr_status"] = "no_tabular_rows_detected"
    except Exception:
        cnn_report["ocr_status"] = "ocr_not_available"

    return 0, cnn_report
