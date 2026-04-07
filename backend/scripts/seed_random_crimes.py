from __future__ import annotations

import argparse
import random
import sys
from datetime import datetime, timedelta
from pathlib import Path

from sqlalchemy.orm import Session

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.fir import FIRRecord
from app.services.ml_service import crime_model_service

STATIONS = [
    "T. Nagar PS",
    "Adyar PS",
    "Velachery PS",
    "Anna Nagar PS",
    "Mylapore PS",
    "Tambaram PS",
    "Egmore PS",
    "Coimbatore Central PS",
    "Madurai Town PS",
    "Hyderabad Central PS",
    "Bengaluru South PS",
]

CITY_POINTS = {
    "Chennai": (13.0827, 80.2707),
    "Bengaluru": (12.9716, 77.5946),
    "Hyderabad": (17.3850, 78.4867),
    "Coimbatore": (11.0168, 76.9558),
    "Madurai": (9.9252, 78.1198),
}

CRIMES = [
    {"code": "302", "type": "IPC-Murder", "severity": 5, "women_bias": 0.03, "accident": False},
    {"code": "307", "type": "IPC-AttemptToMurder", "severity": 4, "women_bias": 0.05, "accident": False},
    {"code": "379", "type": "IPC-Theft", "severity": 2, "women_bias": 0.02, "accident": False},
    {"code": "380", "type": "IPC-HouseTheft", "severity": 3, "women_bias": 0.03, "accident": False},
    {"code": "392", "type": "IPC-Robbery", "severity": 4, "women_bias": 0.04, "accident": False},
    {"code": "420", "type": "IPC-Fraud", "severity": 3, "women_bias": 0.03, "accident": False},
    {"code": "376", "type": "IPC-SexualOffence", "severity": 5, "women_bias": 0.94, "accident": False},
    {"code": "323", "type": "IPC-Assault", "severity": 2, "women_bias": 0.18, "accident": False},
    {"code": "354", "type": "IPC-OutrageModesty", "severity": 4, "women_bias": 0.96, "accident": False},
    {"code": "NDPS-21", "type": "NDPS-DrugPossession", "severity": 4, "women_bias": 0.02, "accident": False},
    {"code": "NDPS-27", "type": "NDPS-DrugConsumption", "severity": 3, "women_bias": 0.02, "accident": False},
    {"code": "ARMS-25", "type": "ArmsAct-IllegalWeapon", "severity": 4, "women_bias": 0.02, "accident": False},
    {"code": "MV-184", "type": "Accident-RashDriving", "severity": 3, "women_bias": 0.01, "accident": True},
    {"code": "MV-279", "type": "Accident-NegligentDriving", "severity": 3, "women_bias": 0.01, "accident": True},
]

HOTSPOTS = [
    (13.0569, 80.2425),
    (13.0418, 80.2337),
    (12.9352, 77.6245),
    (12.9614, 77.6387),
    (17.4374, 78.4482),
    (11.0183, 76.9725),
    (9.9195, 78.1269),
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Insert random FIR crimes into the configured database.")
    parser.add_argument("--count", type=int, default=75, help="Number of random FIR rows to insert.")
    parser.add_argument("--seed", type=int, default=20260405, help="Random seed for repeatable data.")
    return parser.parse_args()


def random_location() -> tuple[float, float]:
    use_hotspot = random.random() < 0.6
    center = random.choice(HOTSPOTS if use_hotspot else list(CITY_POINTS.values()))
    spread = 0.02 if use_hotspot else 0.08
    lat = center[0] + random.uniform(-spread, spread)
    lon = center[1] + random.uniform(-spread, spread)
    return round(lat, 6), round(lon, 6)


def random_occurred_at() -> datetime:
    now = datetime.utcnow()
    days_ago = random.randint(0, 240)
    return (now - timedelta(days=days_ago)).replace(
        hour=random.randint(0, 23),
        minute=random.randint(0, 59),
        second=0,
        microsecond=0,
    )


def random_record(index: int) -> FIRRecord:
    crime = random.choice(CRIMES)
    station = random.choice(STATIONS)
    lat, lon = random_location()
    city = random.choice(list(CITY_POINTS.keys()))
    locality = random.choice([
        "Market Road",
        "Bus Stand",
        "Railway Colony",
        "Central Junction",
        "Lake View",
        "Temple Street",
        "Industrial Estate",
        "IT Corridor",
        "Old Town",
        "Ring Road",
    ])
    women_probability = crime["women_bias"]
    description = (
        f"Random FIR seed #{index + 1}: {crime['type']} reported near {locality}, {city}. "
        f"Patrol review requested by {station}."
    )
    return FIRRecord(
        crime_code=crime["code"],
        crime_type=crime["type"],
        occurred_at=random_occurred_at(),
        latitude=lat,
        longitude=lon,
        address=f"{locality}, {city}",
        description=description,
        police_station=station,
        is_accident=crime["accident"],
        is_women_related=random.random() < women_probability,
        severity=crime["severity"],
    )


def main() -> None:
    args = parse_args()
    random.seed(args.seed)
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        rows = [random_record(i) for i in range(args.count)]
        db.add_all(rows)
        db.commit()
        total = db.query(FIRRecord).count()
        records = db.query(FIRRecord).all()
        trained = crime_model_service.train(records)
        print(f"Inserted {len(rows)} FIR records.")
        print(f"Total FIR records in database: {total}")
        print("Model trained." if trained else "Model training skipped.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
