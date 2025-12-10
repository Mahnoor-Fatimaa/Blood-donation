from sqlalchemy import Column, Integer, String, Date, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

# ---------------------------
# User table (both Donor & Recipient)
# ---------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # "donor" or "recipient"
    phone_number = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    blood_group = Column(String, nullable=True)
    city = Column(String, nullable=True)
    last_donation_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    donor_profile = relationship("DonorProfile", back_populates="user", uselist=False)
    recipient_requests = relationship("RecipientRequest", back_populates="user")
    donation_history = relationship("DonationHistory", back_populates="user")


# ---------------------------
# Donor Profile
# ---------------------------
class DonorProfile(Base):
    __tablename__ = "donor_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    blood_group = Column(String, nullable=False)
    city = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    last_donation_date = Column(Date, nullable=True)
    eligibility = Column(Boolean, default=True)  # True if eligible to donate

    user = relationship("User", back_populates="donor_profile")


# ---------------------------
# Recipient Blood Requests
# ---------------------------
class RecipientRequest(Base):
    __tablename__ = "recipient_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    blood_group = Column(String, nullable=False)
    city = Column(String, nullable=False)
    urgency = Column(String, default="normal")  # normal / high
    created_at = Column(DateTime, default=datetime.utcnow)
    fulfilled = Column(Boolean, default=False)  # Has request been fulfilled

    user = relationship("User", back_populates="recipient_requests")


# ---------------------------
# Donation / Receiving History
# ---------------------------
class DonationHistory(Base):
    __tablename__ = "donation_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # "donation" when user donated blood, "received" when user received blood
    entry_type = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    hospital = Column(String, nullable=False)
    blood_group = Column(String, nullable=False)

    user = relationship("User", back_populates="donation_history")
