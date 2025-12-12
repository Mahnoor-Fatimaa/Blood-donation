from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import date
from app.database import get_db
from app.models import DonationHistory, User
from app.routers.auth_routes import get_current_db_user

router = APIRouter()

class HistoryCreate(BaseModel):
    hospital: str
    blood_group: str
    date: date
    units: int = 1

@router.post("/", status_code=status.HTTP_201_CREATED)
def log_history(
    data: HistoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user)
):
    entry = DonationHistory(
        user_id=current_user.id,
        entry_type="donation",
        hospital=data.hospital,
        blood_group=data.blood_group,
        date=data.date,
        quantity=data.units
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry