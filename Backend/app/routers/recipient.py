from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models import RecipientRequest, DonorProfile, User as UserModel
from app.routers.auth_routes import get_current_db_user

# Import matching logic safely
try:
    from app.matching import find_matching_donors
except ImportError:
    find_matching_donors = None

router = APIRouter()

# --- Schema for Incoming Request ---
class RecipientRequestCreate(BaseModel):
    blood_group: str
    city: str
    urgency: str = "normal"

@router.get("/me")
async def read_my_profile(current_user: UserModel = Depends(get_current_db_user)):
    return {"message": "Recipient profile data", "user": {"id": current_user.id, "email": current_user.email}}

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_request(
    request_data: RecipientRequestCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_db_user)
):
    # REMOVED: The check that blocked donors from requesting.
    # Now, ANY logged-in user can create a request.
    
    new_request = RecipientRequest(
        user_id=current_user.id,
        blood_group=request_data.blood_group,
        city=request_data.city,
        urgency=request_data.urgency
    )
    
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    
    return new_request

@router.get("/matches/{request_id}")
async def get_matches(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_db_user)
):
    request = db.query(RecipientRequest).filter(RecipientRequest.id == request_id).first()
    
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    matches = []
    if find_matching_donors:
        donors = db.query(DonorProfile).join(UserModel).all()
        matches = find_matching_donors(donors, request.blood_group, request.city)
    
    return {
        "request_id": request_id,
        "blood_group": request.blood_group,
        "city": request.city,
        "matches": [
            {
                "id": d.id,
                "name": d.user.full_name,
                "blood_group": d.blood_group,
                "city": d.city,
                "last_donation_date": d.last_donation_date
            } for d in matches
        ]
    }