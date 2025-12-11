from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import RecipientRequest, DonorProfile, User as UserModel
from app.routers.auth_routes import get_current_db_user
from app.matching import find_matching_donors

router = APIRouter()


@router.get("/me")
async def read_my_profile(current_user: UserModel = Depends(get_current_db_user)):
    """Get current recipient profile."""
    return {"message": "Recipient profile data", "user": {"id": current_user.id, "email": current_user.email}}


@router.post("/")
async def create_request(
    data: dict,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_db_user)
):
    """Create a new blood request."""
    if current_user.role != "recipient":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only users with role 'recipient' can create requests."
        )
    
    blood_group = data.get("blood_group")
    city = data.get("city")
    urgency = data.get("urgency", "normal")
    
    if not blood_group or not city:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="blood_group and city are required."
        )
    
    request = RecipientRequest(
        user_id=current_user.id,
        blood_group=blood_group,
        city=city,
        urgency=urgency
    )
    
    db.add(request)
    db.commit()
    db.refresh(request)
    
    return request


@router.get("/matches/{request_id}")
async def get_matches(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_db_user)
):
    """Find matching donors for a request."""
    request = db.query(RecipientRequest).filter(
        RecipientRequest.id == request_id
    ).first()
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
    
    # Get all donors
    donors = db.query(DonorProfile).all()
    
    # Find matches
    matches = find_matching_donors(donors, request.blood_group, request.city)
    
    return {
        "request_id": request_id,
        "blood_group": request.blood_group,
        "city": request.city,
        "matches": [
            {
                "id": donor.id,
                "name": donor.user.full_name,
                "blood_group": donor.blood_group,
                "city": donor.city,
                "last_donation_date": donor.last_donation_date
            }
            for donor in matches
        ]
    }