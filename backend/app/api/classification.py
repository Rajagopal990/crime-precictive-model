from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.services.fir_service import list_firs
from app.services.ml_service import crime_model_service

router = APIRouter(prefix="/classification", tags=["classification"])


class ClassificationRequest(BaseModel):
    crime_code: str
    description: str = ""


ACT_MAP = {
    "IPC": ["302", "307", "379", "420", "376", "323"],
    "NDPS": ["NDPS-21", "NDPS-22", "NDPS-27"],
    "ARMS": ["ARMS-25", "ARMS-27"],
    "MOTOR": ["MV-184", "MV-185"],
}


@router.post("/tag")
def classify(
    payload: ClassificationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _ = current_user
    records = list_firs(db)
    if not crime_model_service.classifier_bundle:
        crime_model_service.train(records)

    ml_result = crime_model_service.classify_crime(payload.crime_code.upper().strip(), payload.description)

    code = payload.crime_code.upper().strip()
    legal_category = "IPC"
    for category, codes in ACT_MAP.items():
        if code in codes:
            legal_category = category
            break

    return {
        "category": legal_category,
        "predicted_crime_type": ml_result["crime_type"],
        "confidence": ml_result["confidence"],
    }
