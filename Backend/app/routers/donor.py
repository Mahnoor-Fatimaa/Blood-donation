from datetime import date
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import DonorProfile, User as UserModel
from app.routers.auth_routes import get_current_db_user
from app.schemas import DonorListItem

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
def upsert_donor_profile(
    data: dict,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_db_user),
):
    # REMOVED: The check that blocked recipients from becoming donors.
    # Now, ANY user can register as a donor.

    existing = (
        db.query(DonorProfile).filter(DonorProfile.user_id == current_user.id).first()
    )

    blood_group = data.get("blood_group")
    city = data.get("city")
    age = data.get("age")
    last_donation_date_raw = data.get("last_donation_date")

    last_donation_date = None
    if last_donation_date_raw:
        try:
            last_donation_date = date.fromisoformat(last_donation_date_raw)
        except ValueError:
            pass # Handle invalid date format gracefully

    if not blood_group or not city or age is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="blood_group, city and age are required.",
        )

    if existing:
        existing.blood_group = blood_group
        existing.city = city
        existing.age = age
        existing.last_donation_date = last_donation_date
        db.add(existing)
        db.commit()
        db.refresh(existing)
        return existing

    profile = DonorProfile(
        user_id=current_user.id,
        blood_group=blood_group,
        city=city,
        age=age,
        last_donation_date=last_donation_date,
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

@router.get("/all", response_model=List[DonorListItem])
def list_donors(db: Session = Depends(get_db)):
    profiles = db.query(DonorProfile).join(UserModel).all()
    items = []
    for profile in profiles:
        items.append(profile)
    return items