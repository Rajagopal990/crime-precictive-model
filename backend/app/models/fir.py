from datetime import datetime

from sqlalchemy import DateTime, Float, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class FIRRecord(Base):
    __tablename__ = "fir_records"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    crime_code: Mapped[str] = mapped_column(String(30), nullable=False, index=True)
    crime_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    occurred_at: Mapped[datetime] = mapped_column(DateTime, index=True, nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    police_station: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    is_accident: Mapped[bool] = mapped_column(default=False)
    is_women_related: Mapped[bool] = mapped_column(default=False)
    severity: Mapped[int] = mapped_column(default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
