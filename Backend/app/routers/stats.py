from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database import get_db
from app.models import User, DonorProfile, RecipientRequest, DonationHistory
from app.routers.auth_routes import get_current_db_user

router = APIRouter()

@router.get("/dashboard")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_db_user)
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
    # Since we don't have a 'BloodBank' inventory table, we count *available donors* as our stock.
    stock_query = db.query(
        DonorProfile.blood_group, func.count(DonorProfile.id)
    ).group_by(DonorProfile.blood_group).all()
    
    # Convert query result to a nice list
    # e.g., [{"group": "A+", "units": 12}, ...]
    stock_levels = [{"group": row[0], "units": row[1]} for row in stock_query]

    # 5. Recent Activity Feed (Last 5 actions)
    recent_activity = db.query(DonationHistory).order_by(DonationHistory.date.desc()).limit(5).all()
    formatted_activity = [
        {
            "donor": entry.user.full_name, # Access User name via relationship
            "group": entry.blood_group,
            "city": entry.hospital, # Using hospital field as location
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