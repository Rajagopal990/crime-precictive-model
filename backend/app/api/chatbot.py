from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.services.fir_service import list_firs

router = APIRouter(prefix="/assistant", tags=["assistant"])


class ChatRequest(BaseModel):
    query: str


@router.post("/chat")
def chat(payload: ChatRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    _ = current_user
    records = list_firs(db)
    q = payload.query.lower()

    if "highest crime" in q or "hotspot" in q:
        by_station: dict[str, int] = {}
        for r in records:
            by_station[r.police_station] = by_station.get(r.police_station, 0) + 1
        top = sorted(by_station.items(), key=lambda x: x[1], reverse=True)[:3]
        text = "Top stations by FIR volume: " + ", ".join([f"{s} ({c})" for s, c in top])
    elif "women" in q:
        women_cases = len([r for r in records if r.is_women_related])
        text = f"Women-related incidents recorded: {women_cases}. Increase evening patrol in affected clusters."
    elif "accident" in q:
        accident_cases = len([r for r in records if r.is_accident])
        text = f"Accident-linked FIR records: {accident_cases}. Recommend traffic-calming patrol during peak hours."
    else:
        text = (
            "Ask me about hotspots, women safety, accidents, or station-wise crime trends "
            "for actionable patrol suggestions."
        )

    return {"response": text}
