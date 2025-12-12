from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User, DonorProfile, RecipientRequest, DonationHistory
# FIX: Import correctly from app.auth
from app.auth import get_current_user

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    # FIX: Use get_current_user
    current_user: User = Depends(get_current_user)
):
    # 1. Total Donors (Count donor profiles)
    total_donors = db.query(DonorProfile).count()

    # 2. Pending Requests (Unfulfilled requests)
    pending_requests = db.query(RecipientRequest).filter(RecipientRequest.fulfilled == False).count()

    # 3. Recent Donations (Donations in last 30 days)
    last_month = datetime.now().date() - timedelta(days=30)
    recent_donations = db.query(DonationHistory).filter(
        DonationHistory.entry_type == "donation",
        DonationHistory.date >= last_month
    ).count()

    # 4. Blood Stock Levels (Count of Donors by Blood Group)
    stock_query = db.query(
        DonorProfile.blood_group, func.count(DonorProfile.id)
    ).group_by(DonorProfile.blood_group).all()
    
    stock_levels = [{"group": row[0], "units": row[1]} for row in stock_query]

    # 5. Recent Activity Feed (Last 5 actions)
    recent_activity = db.query(DonationHistory).order_by(DonationHistory.date.desc()).limit(5).all()
    formatted_activity = [
        {
            "donor": entry.user.full_name if entry.user else "Unknown",
            "group": entry.blood_group,
            "city": entry.hospital, 
            "time": entry.date.strftime("%Y-%m-%d")
        }
        for entry in recent_activity
    ]

    return {
        "total_donors": total_donors,
        "pending_requests": pending_requests,
        "recent_donations_count": recent_donations,
        "stock_levels": stock_levels,
        "recent_activity": formatted_activity
    }