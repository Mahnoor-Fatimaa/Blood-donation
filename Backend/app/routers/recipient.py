from fastapi import APIRouter, Depends
from app.routers.auth_routes import get_current_user, User

router = APIRouter()

@router.get("/me")
async def read_my_profile(current_user: User = Depends(get_current_user)):
    return {"message": "Recipient profile data", "user": current_user}
