from __future__ import annotations

import argparse
import csv
import json
import random
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data" / "base"
DATA_DIR.mkdir(parents=True, exist_ok=True)

COMMON_STATIONS = [
    "T. Nagar PS",
    "Adyar PS",
    "Velachery PS",
    "Anna Nagar PS",
    "Mylapore PS",
    "Tambaram PS",
]

CITY_CENTERS = {
    "Chennai": (13.0827, 80.2707),
    "Bengaluru": (12.9716, 77.5946),
    "Hyderabad": (17.3850, 78.4867),
}


@dataclass(frozen=True)
class CrimeTemplate:
    code: str
    crime_type: str
    severity: int
    women_bias: float = 0.05
    accident: bool = False


@dataclass(frozen=True)
class DatasetProfile:
    slug: str
    label: str
    total: int
    centers: list[str]
    stations: list[str]
    max_days_ago: int
    hotspots: list[tuple[float, float]]
    crime_weights: list[tuple[CrimeTemplate, float]]
    output_formats: tuple[str, ...] = ("csv", "json")


CRIME_LIBRARY = {
    "murder": CrimeTemplate("302", "IPC-Murder", 5, women_bias=0.03),
    "attempt_murder": CrimeTemplate("307", "IPC-AttemptToMurder", 4, women_bias=0.04),
    "theft": CrimeTemplate("379", "IPC-Theft", 2, women_bias=0.02),
    "fraud": CrimeTemplate("420", "IPC-Fraud", 3, women_bias=0.03),
    "sexual_offence": CrimeTemplate("376", "IPC-SexualOffence", 5, women_bias=0.92),
    "assault": CrimeTemplate("323", "IPC-Assault", 2, women_bias=0.14),
    "drug_possession": CrimeTemplate("NDPS-21", "NDPS-DrugPossession", 4, women_bias=0.02),
    "drug_consumption": CrimeTemplate("NDPS-27", "NDPS-DrugConsumption", 3, women_bias=0.03),
    "illegal_weapon": CrimeTemplate("ARMS-25", "ArmsAct-IllegalWeapon", 4, women_bias=0.02),
    "rash_driving": CrimeTemplate("MV-184", "Accident-RashDriving", 3, women_bias=0.01, accident=True),
}

DATASET_PROFILES = [
    DatasetProfile(
        slug="city_pulse_300",
        label="Balanced multi-city starter data for general dashboard demos",
        total=300,
        centers=["Chennai", "Bengaluru", "Hyderabad"],
        stations=COMMON_STATIONS,
        max_days_ago=365,
        hotspots=[
            (13.0569, 80.2425),
            (12.9352, 77.6245),
            (17.4374, 78.4482),
        ],
        crime_weights=[
            (CRIME_LIBRARY["theft"], 0.22),
            (CRIME_LIBRARY["fraud"], 0.14),
            (CRIME_LIBRARY["assault"], 0.13),
            (CRIME_LIBRARY["rash_driving"], 0.12),
            (CRIME_LIBRARY["drug_possession"], 0.10),
            (CRIME_LIBRARY["drug_consumption"], 0.09),
            (CRIME_LIBRARY["illegal_weapon"], 0.07),
            (CRIME_LIBRARY["sexual_offence"], 0.06),
            (CRIME_LIBRARY["attempt_murder"], 0.04),
            (CRIME_LIBRARY["murder"], 0.03),
        ],
    ),
    DatasetProfile(
        slug="women_safety_180",
        label="Women safety heavy sample for hotspot and alert demos",
        total=180,
        centers=["Chennai", "Bengaluru"],
        stations=["Adyar PS", "Mylapore PS", "T. Nagar PS", "Anna Nagar PS"],
        max_days_ago=240,
        hotspots=[
            (13.0418, 80.2337),
            (13.0474, 80.2573),
            (12.9614, 77.6387),
        ],
        crime_weights=[
            (CRIME_LIBRARY["sexual_offence"], 0.36),
            (CRIME_LIBRARY["assault"], 0.20),
            (CRIME_LIBRARY["fraud"], 0.12),
            (CRIME_LIBRARY["theft"], 0.11),
            (CRIME_LIBRARY["attempt_murder"], 0.07),
            (CRIME_LIBRARY["drug_possession"], 0.05),
            (CRIME_LIBRARY["illegal_weapon"], 0.05),
            (CRIME_LIBRARY["rash_driving"], 0.04),
        ],
    ),
    DatasetProfile(
        slug="accident_hotspots_180",
        label="Traffic and accident focused sample for cluster analysis",
        total=180,
        centers=["Chennai", "Hyderabad"],
        stations=["Tambaram PS", "Velachery PS", "Anna Nagar PS", "T. Nagar PS"],
        max_days_ago=180,
        hotspots=[
            (12.9791, 80.2208),
            (13.0280, 80.1846),
            (17.4227, 78.4411),
        ],
        crime_weights=[
            (CRIME_LIBRARY["rash_driving"], 0.54),
            (CRIME_LIBRARY["theft"], 0.10),
            (CRIME_LIBRARY["assault"], 0.09),
            (CRIME_LIBRARY["fraud"], 0.08),
            (CRIME_LIBRARY["drug_possession"], 0.07),
            (CRIME_LIBRARY["illegal_weapon"], 0.05),
            (CRIME_LIBRARY["attempt_murder"], 0.04),
            (CRIME_LIBRARY["murder"], 0.03),
        ],
    ),
]


def random_timestamp(max_days_ago: int) -> datetime:
    now = datetime.utcnow()
    days_ago = random.randint(0, max_days_ago)
    base = now - timedelta(days=days_ago)
    return base.replace(
        hour=random.randint(0, 23),
        minute=random.randint(0, 59),
        second=0,
        microsecond=0,
    )


def random_location(profile: DatasetProfile) -> tuple[float, float]:
    hotspot_mode = random.random() < 0.65 and profile.hotspots
    center = random.choice(profile.hotspots if hotspot_mode else [CITY_CENTERS[city] for city in profile.centers])
    spread = 0.018 if hotspot_mode else 0.075
    lat = center[0] + random.uniform(-spread, spread)
    lon = center[1] + random.uniform(-spread, spread)
    return round(lat, 6), round(lon, 6)


def choose_crime(profile: DatasetProfile) -> CrimeTemplate:
    crimes = [crime for crime, _ in profile.crime_weights]
    weights = [weight for _, weight in profile.crime_weights]
    return random.choices(crimes, weights=weights, k=1)[0]


def build_description(crime: CrimeTemplate, station: str, idx: int) -> str:
    return (
        f"Base dataset FIR #{idx + 1}: {crime.crime_type} recorded near patrol zone "
        f"served by {station}. Generated for analytics, upload, and demo seeding."
    )


def generate_profile_records(profile: DatasetProfile) -> list[dict]:
    records = []
    for idx in range(profile.total):
        crime = choose_crime(profile)
        station = random.choice(profile.stations)
        occurred_at = random_timestamp(profile.max_days_ago)
        latitude, longitude = random_location(profile)
        women_probability = crime.women_bias
        if profile.slug == "women_safety_180":
            women_probability = min(0.98, women_probability + 0.18)

        record = {
            "crime_code": crime.code,
            "crime_type": crime.crime_type,
            "occurred_at": occurred_at.isoformat(),
            "latitude": latitude,
            "longitude": longitude,
            "address": f"Sector {random.randint(1, 50)}, Zone {random.randint(1, 12)}",
            "description": build_description(crime, station, idx),
            "police_station": station,
            "is_accident": crime.accident,
            "is_women_related": random.random() < women_probability,
            "severity": crime.severity,
        }
        records.append(record)
    return records


def write_csv(path: Path, records: list[dict]) -> None:
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(records[0].keys()))
        writer.writeheader()
        writer.writerows(records)


def write_json(path: Path, records: list[dict]) -> None:
    with path.open("w", encoding="utf-8") as handle:
        json.dump(records, handle, indent=2)


def export_profile(profile: DatasetProfile) -> list[Path]:
    records = generate_profile_records(profile)
    written: list[Path] = []
    for fmt in profile.output_formats:
        target = DATA_DIR / f"fir_{profile.slug}.{fmt}"
        if fmt == "csv":
            write_csv(target, records)
        elif fmt == "json":
            write_json(target, records)
        else:
            raise ValueError(f"Unsupported format: {fmt}")
        written.append(target)
    return written


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate starter FIR datasets for the demo project.")
    parser.add_argument(
        "--dataset",
        choices=["all", *[profile.slug for profile in DATASET_PROFILES]],
        default="all",
        help="Which starter dataset to generate.",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=20260405,
        help="Random seed for reproducible starter datasets.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    random.seed(args.seed)
    profiles = DATASET_PROFILES if args.dataset == "all" else [p for p in DATASET_PROFILES if p.slug == args.dataset]

    for profile in profiles:
        files = export_profile(profile)
        rendered = ", ".join(path.name for path in files)
        print(f"{profile.slug}: wrote {rendered}")


if __name__ == "__main__":
    main()
