from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class FIRBase(BaseModel):
    crime_code: str = Field(min_length=2, max_length=30)
    crime_type: str = Field(min_length=2, max_length=100)
    occurred_at: datetime
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    address: str = Field(min_length=3, max_length=255)
    description: str = Field(min_length=3, max_length=3000)
    police_station: str = Field(min_length=2, max_length=120)
    is_accident: bool = False
    is_women_related: bool = False
    severity: int = Field(default=1, ge=1, le=5)

    @field_validator("crime_code")
    @classmethod
    def normalize_code(cls, value: str) -> str:
        return value.upper().strip()


class FIRCreate(FIRBase):
    pass


class FIROut(FIRBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class FIRFilter(BaseModel):
    crime_type: str | None = None
    police_station: str | None = None
    from_date: datetime | None = None
    to_date: datetime | None = None
    time_slot: str | None = None
