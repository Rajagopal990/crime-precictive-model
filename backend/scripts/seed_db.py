from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd
from sqlalchemy.orm import Session

from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.fir import FIRRecord
from app.services.ml_service import crime_model_service

BASE_DIR = Path(__file__).resolve().parents[1]
CSV_FILE = BASE_DIR / "data" / "fir_dummy_1200.csv"


def to_bool(value) -> bool:
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in {"1", "true", "yes", "y"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Seed the FIR table from a CSV dataset.")
    parser.add_argument(
        "--file",
        default=str(CSV_FILE),
        help="Path to a CSV file that matches the FIR upload schema.",
    )
    return parser.parse_args()


def run(csv_path: str | Path) -> None:
    Base.metadata.create_all(bind=engine)
    csv_file = Path(csv_path).resolve()
    df = pd.read_csv(csv_file)
    db: Session = SessionLocal()
    try:
        if db.query(FIRRecord).count() > 0:
            print("FIR records already seeded; skipping insert.")
        else:
            for _, row in df.iterrows():
                db.add(
                    FIRRecord(
                        crime_code=row["crime_code"],
                        crime_type=row["crime_type"],
                        occurred_at=pd.to_datetime(row["occurred_at"]).to_pydatetime(),
                        latitude=float(row["latitude"]),
                        longitude=float(row["longitude"]),
                        address=row["address"],
                        description=row["description"],
                        police_station=row["police_station"],
                        is_accident=to_bool(row["is_accident"]),
                        is_women_related=to_bool(row["is_women_related"]),
                        severity=int(row["severity"]),
                    )
                )
            db.commit()
            print(f"Inserted {len(df)} FIR records from {csv_file.name}.")

        records = db.query(FIRRecord).all()
        trained = crime_model_service.train(records)
        print("Model trained." if trained else "Model training skipped.")
    finally:
        db.close()


if __name__ == "__main__":
    args = parse_args()
    run(args.file)
