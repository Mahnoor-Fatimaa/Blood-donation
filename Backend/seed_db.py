import random
from datetime import datetime, timedelta
from app.database import SessionLocal, engine
from app.models import Base, User, DonorProfile, RecipientRequest, DonationHistory
from app.auth import hash_password

print("🗑️  Cleaning database...")
Base.metadata.drop_all(bind=engine)
print("✨ Creating fresh tables...")
Base.metadata.create_all(bind=engine)
db = SessionLocal()

print("🌱 Generating Rich Dataset...")

BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
CITIES = ["Lahore", "Karachi", "Islamabad", "Peshawar", "Quetta", "Multan", "Faisalabad"]
HOSPITALS = ["Mayo Hospital", "Aga Khan", "Shifa Int.", "Lady Reading", "Civil Hospital"]
NAMES = ["Ali", "Sara", "Ahmed", "Zara", "Bilal", "Hina", "Omar", "Fatima", "Zain", "Sana"]

# --- 1. CREATE 50 DONORS ---
donors = []
for i in range(50):
    user = User(
        full_name=f"{random.choice(NAMES)} {random.choice(NAMES)}",
        email=f"donor{i}@example.com",
        # REMOVED CNIC HERE
        password=hash_password("password123"),
        role="donor",
        phone_number=f"0300{random.randint(1000000, 9999999)}",
        age=random.randint(18, 45),
        blood_group=random.choice(BLOOD_GROUPS),
        city=random.choice(CITIES)
    )
    db.add(user)
    db.commit()
    
    profile = DonorProfile(
        user_id=user.id,
        blood_group=user.blood_group,
        city=user.city,
        age=user.age,
        last_donation_date=datetime.now().date() - timedelta(days=random.randint(60, 500))
    )
    db.add(profile)
    donors.append(user)

db.commit()
print("✅ Created 50 Donors.")

# --- 2. REQUESTS ---
for i in range(20):
    requester = random.choice(donors)
    req = RecipientRequest(
        user_id=requester.id,
        blood_group=random.choice(BLOOD_GROUPS),
        city=random.choice(CITIES),
        urgency=random.choice(["normal", "high", "critical"]),
        fulfilled=False,
        created_at=datetime.now() - timedelta(days=random.randint(0, 5))
    )
    db.add(req)

db.commit()
print("✅ Created 20 Active Requests.")

# --- 3. HISTORY ---
for i in range(30):
    entry = DonationHistory(
        user_id=random.choice(donors).id,
        entry_type="donation",
        date=datetime.now().date() - timedelta(days=random.randint(1, 60)),
        hospital=random.choice(HOSPITALS),
        blood_group=random.choice(BLOOD_GROUPS),
        quantity=1
    )
    db.add(entry)

db.commit()
db.close()
print("🎉 Dataset Generation Complete!")