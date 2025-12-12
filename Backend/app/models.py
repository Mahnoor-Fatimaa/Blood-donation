from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    # CNIC Removed
    password = Column(String)
    role = Column(String)
    phone_number = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    blood_group = Column(String, nullable=True)
    city = Column(String, nullable=True)
    
    # Relationships (Must exist to prevent crashes)
    history = relationship("DonationHistory", back_populates="user", cascade="all, delete-orphan")
    donor_profile = relationship("DonorProfile", back_populates="user", uselist=False)
    requests = relationship("RecipientRequest", back_populates="user")

# ... (Keep DonorProfile, RecipientRequest, DonationHistory EXACTLY as they were in the previous step) ...
# To be safe, I will include the full file below so nothing is missed.

class DonorProfile(Base):
    __tablename__ = "donor_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    blood_group = Column(String)
    city = Column(String)
    age = Column(Integer)
    last_donation_date = Column(Date, nullable=True)
    user = relationship("User", back_populates="donor_profile")

class RecipientRequest(Base):
    __tablename__ = "recipient_requests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    blood_group = Column(String)
    city = Column(String)
    urgency = Column(String, default="normal")
    fulfilled = Column(Boolean, default=False)
    created_at = Column(Date, nullable=True)
    user = relationship("User", back_populates="requests")

class DonationHistory(Base):
    __tablename__ = "donation_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    entry_type = Column(String)
    date = Column(Date)
    hospital = Column(String)
    blood_group = Column(String)
    quantity = Column(Integer, default=1)
    user = relationship("User", back_populates="history")