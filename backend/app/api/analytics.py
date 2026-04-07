from collections import defaultdict
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.services.fir_service import list_firs
from app.services.ml_service import crime_model_service

router = APIRouter(prefix="/analytics", tags=["analytics"])


def _risk_level_from_score(score: float) -> str:
    if score >= 30:
        return "high"
    if score >= 14:
        return "medium"
    return "low"


def _build_risk_zones(records: list) -> list[dict]:
    grouped: dict[str, dict] = defaultdict(
        lambda: {
            "incidents": 0,
            "severity_total": 0,
            "women_related": 0,
            "latest": None,
            "lat_sum": 0.0,
            "lon_sum": 0.0,
        }
    )

    for row in records:
        station = row.police_station or "Unknown"
        bucket = grouped[station]
        bucket["incidents"] += 1
        bucket["severity_total"] += row.severity
        bucket["women_related"] += 1 if row.is_women_related else 0
        bucket["lat_sum"] += row.latitude
        bucket["lon_sum"] += row.longitude
        if bucket["latest"] is None or row.occurred_at > bucket["latest"]:
            bucket["latest"] = row.occurred_at

    zones = []
    for station, bucket in grouped.items():
        incidents = bucket["incidents"]
        severity_total = bucket["severity_total"]
        women_related = bucket["women_related"]
        score = (incidents * 0.6) + (severity_total * 0.4) + (women_related * 1.5)
        level = _risk_level_from_score(score)
        zones.append(
            {
                "area": station,
                "level": level,
                "risk_score": round(score, 2),
                "incident_count": incidents,
                "latitude": round(bucket["lat_sum"] / incidents, 5),
                "longitude": round(bucket["lon_sum"] / incidents, 5),
                "last_incident_at": bucket["latest"].isoformat() if bucket["latest"] else None,
            }
        )

    return sorted(zones, key=lambda item: item["risk_score"], reverse=True)


def _build_live_updates(records: list) -> list[dict]:
    updates = []
    for row in sorted(records, key=lambda item: item.created_at, reverse=True)[:8]:
        risk_level = "high" if row.severity >= 4 else "medium" if row.severity >= 3 else "low"
        updates.append(
            {
                "crime_type": row.crime_type,
                "police_station": row.police_station,
                "address": row.address,
                "occurred_at": row.occurred_at.isoformat(),
                "risk_level": risk_level,
            }
        )
    return updates


def _build_patrol_suggestions(route: dict, hotspots: list[dict], zones: list[dict]) -> list[str]:
    if not route.get("route"):
        return ["No active route yet. Add more FIR points to generate a smart patrol path."]

    suggestions = []
    top_hotspots = hotspots[:3]
    high_zones = [zone for zone in zones if zone["level"] == "high"][:2]

    for idx, point in enumerate(route["route"], start=1):
        suggestions.append(f"Checkpoint {idx}: patrol [{point['latitude']}, {point['longitude']}].")

    if top_hotspots:
        suggestions.append(
            f"Priority coverage on top hotspot risk score {top_hotspots[0]['risk_score']} ({top_hotspots[0]['count']} incidents)."
        )
    if high_zones:
        focus_areas = ", ".join(zone["area"] for zone in high_zones)
        suggestions.append(f"Allocate additional teams around high-risk stations: {focus_areas}.")

    return suggestions[:7]


@router.get("/dashboard")
def dashboard_data(
    crime_type: str | None = Query(default=None),
    police_station: str | None = Query(default=None),
    from_date: datetime | None = Query(default=None),
    to_date: datetime | None = Query(default=None),
    time_slot: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _ = current_user
    records = list_firs(db, crime_type, police_station, from_date, to_date, time_slot)
    hotspots = crime_model_service.build_hotspots(records)
    behavior = crime_model_service.behavioral_summary(records)
    women = crime_model_service.women_safety(records)
    accidents = crime_model_service.accident_clusters(records)
    route = crime_model_service.patrol_route(hotspots)
    risk_zones = _build_risk_zones(records)
    live_updates = _build_live_updates(records)

    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent = [r for r in records if r.occurred_at >= thirty_days_ago]

    alert_zones = [h for h in hotspots[:5] if h["level"] == "high"]
    alerts = [
        {
            "message": f"High crime warning near ({z['latitude']}, {z['longitude']})",
            "risk_score": z["risk_score"],
        }
        for z in alert_zones
    ]

    risk_distribution = {
        "high": len([h for h in hotspots if h["level"] == "high"]),
        "medium": len([h for h in hotspots if h["level"] == "medium"]),
        "low": len([h for h in hotspots if h["level"] == "low"]),
    }

    return {
        "summary": {
            "total_crimes": len(records),
            "last_30_days": len(recent),
            "high_hotspots": len([h for h in hotspots if h["level"] == "high"]),
        },
        "hotspots": hotspots,
        "risk_distribution": risk_distribution,
        "risk_zones": risk_zones,
        "live_updates": live_updates,
        "behavior": behavior,
        "women_safety": women,
        "accident_clusters": accidents,
        "patrol_route": route,
        "patrol_suggestions": _build_patrol_suggestions(route, hotspots, risk_zones),
        "alerts": alerts,
    }
