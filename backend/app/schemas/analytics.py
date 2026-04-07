from pydantic import BaseModel


class HotspotPoint(BaseModel):
    latitude: float
    longitude: float
    risk_score: float
    level: str
    count: int


class RiskPrediction(BaseModel):
    probability: float
    label: str


class BehavioralSummary(BaseModel):
    by_hour: dict[str, int]
    by_month: dict[str, int]
    by_station: dict[str, int]


class PatrolRoute(BaseModel):
    route: list[dict[str, float]]
    risk_weight: float


class WomenSafetyPoint(BaseModel):
    latitude: float
    longitude: float
    women_related_count: int
    risk_label: str


class AccidentCluster(BaseModel):
    latitude: float
    longitude: float
    size: int
