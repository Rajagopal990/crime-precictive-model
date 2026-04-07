from datetime import datetime

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.db.session import get_db
from app.models.user import User
from app.schemas.fir import FIRCreate, FIROut
from app.services.fir_service import (
    create_fir,
    ingest_csv,
    ingest_excel,
    ingest_image_with_cnn,
    ingest_json,
    ingest_pdf,
    list_firs,
)
from app.services.ml_service import build_prediction_features, crime_model_service

router = APIRouter(prefix="/firs", tags=["firs"])
MAX_UPLOAD_BYTES = 8 * 1024 * 1024
VIDEO_EXTENSIONS = {".mp4", ".mov", ".avi", ".mkv", ".webm", ".wmv", ".flv", ".m4v", ".3gp"}
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".bmp", ".webp", ".tiff"}


@router.post("", response_model=FIROut)
def create_fir_endpoint(
    payload: FIRCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "officer"])),
) -> FIROut:
    _ = current_user
    record = create_fir(db, payload)
    records = list_firs(db)
    crime_model_service.train(records)
    return record


@router.get("", response_model=list[FIROut])
def list_firs_endpoint(
    crime_type: str | None = Query(default=None),
    police_station: str | None = Query(default=None),
    from_date: datetime | None = Query(default=None),
    to_date: datetime | None = Query(default=None),
    time_slot: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[FIROut]:
    _ = current_user
    return list_firs(db, crime_type, police_station, from_date, to_date, time_slot)


@router.post("/upload")
async def upload_firs(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "officer"])),
):
    _ = current_user
    content = await file.read()
    filename = (file.filename or "").lower().strip()
    ext = "." + filename.split(".")[-1] if "." in filename else ""
    content_type = (file.content_type or "").lower()

    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File too large. Max size is 8MB")

    if content_type.startswith("video/") or ext in VIDEO_EXTENSIONS:
        raise HTTPException(status_code=415, detail="Video uploads are not allowed. Upload CSV, JSON, Excel, PDF, or image files.")

    cnn_report = None
    source_type = "unknown"

    try:
        if ext == ".csv":
            inserted = ingest_csv(db, content)
            source_type = "csv"
        elif ext == ".json":
            inserted = ingest_json(db, content)
            source_type = "json"
        elif ext in {".xlsx", ".xls"}:
            inserted = ingest_excel(db, content)
            source_type = "excel"
        elif ext == ".pdf":
            inserted = ingest_pdf(db, content)
            source_type = "pdf"
        elif ext in IMAGE_EXTENSIONS or content_type.startswith("image/"):
            inserted, cnn_report = ingest_image_with_cnn(db, content)
            source_type = "image"
        else:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type. Allowed: CSV, JSON, Excel (.xlsx/.xls), PDF, and images. Videos are blocked.",
            )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    records = list_firs(db)
    crime_model_service.train(records)

    response = {"inserted": inserted, "source_type": source_type}
    if cnn_report is not None:
        response["cnn_report"] = cnn_report
    return response


@router.post("/predict")
def predict_crime(
    payload: FIRCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _ = current_user
    records = list_firs(db)
    if not crime_model_service.model_bundle:
        crime_model_service.train(records)
    score = crime_model_service.predict_risk(build_prediction_features(payload.model_dump()))
    label = "high" if score >= 0.7 else "medium" if score >= 0.4 else "low"
    return {"probability": round(score, 4), "label": label}
