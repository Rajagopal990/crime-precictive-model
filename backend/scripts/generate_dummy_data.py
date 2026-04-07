from __future__ import annotations

import csv
import json
import random
from datetime import datetime, timedelta
from pathlib import Path

random.seed(42)

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

STATIONS = [
    "T. Nagar PS",
    "Adyar PS",
    "Velachery PS",
    "Anna Nagar PS",
    "Mylapore PS",
    "Tambaram PS",
]

CRIMES = [
    ("302", "IPC-Murder", 5),
    ("307", "IPC-AttemptToMurder", 4),
    ("379", "IPC-Theft", 2),
    ("420", "IPC-Fraud", 3),
    ("376", "IPC-SexualOffence", 5),
    ("323", "IPC-Assault", 2),
    ("NDPS-21", "NDPS-DrugPossession", 4),
    ("NDPS-27", "NDPS-DrugConsumption", 3),
    ("ARMS-25", "ArmsAct-IllegalWeapon", 4),
    ("MV-184", "Accident-RashDriving", 3),
]

CITY_CENTERS = [
    (13.0827, 80.2707),
    (12.9716, 77.5946),
    (17.3850, 78.4867),
]


def random_location() -> tuple[float, float]:
    c_lat, c_lon = random.choice(CITY_CENTERS)
    lat = c_lat + random.uniform(-0.08, 0.08)
    lon = c_lon + random.uniform(-0.08, 0.08)
    return round(lat, 6), round(lon, 6)


def generate_records(total: int = 1200) -> list[dict]:
    now = datetime.utcnow()
    records = []

    for i in range(total):
        crime_code, crime_type, severity = random.choice(CRIMES)
        days_ago = random.randint(0, 730)
        hour = random.randint(0, 23)
        occurred_at = (now - timedelta(days=days_ago)).replace(hour=hour, minute=random.randint(0, 59), second=0, microsecond=0)
        lat, lon = random_location()

        is_accident = "Accident" in crime_type
        is_women_related = random.random() < (0.28 if "Sexual" in crime_type else 0.06)

        station = random.choice(STATIONS)
        record = {
            "crime_code": crime_code,
            "crime_type": crime_type,
            "occurred_at": occurred_at.isoformat(),
            "latitude": lat,
            "longitude": lon,
            "address": f"Sector {random.randint(1, 99)}, Zone {random.randint(1, 20)}",
            "description": f"FIR narrative sample #{i + 1} for {crime_type}.",
            "police_station": station,
            "is_accident": is_accident,
            "is_women_related": is_women_related,
            "severity": severity,
        }
        records.append(record)

    return records


def write_csv(records: list[dict], path: Path) -> None:
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(records[0].keys()))
        writer.writeheader()
        writer.writerows(records)


def write_json(records: list[dict], path: Path) -> None:
    with path.open("w", encoding="utf-8") as f:
        json.dump(records, f, indent=2)


if __name__ == "__main__":
    rows = generate_records(1200)
    write_csv(rows, DATA_DIR / "fir_dummy_1200.csv")
    write_json(rows, DATA_DIR / "fir_dummy_1200.json")
    print(f"Generated {len(rows)} records in {DATA_DIR}")
