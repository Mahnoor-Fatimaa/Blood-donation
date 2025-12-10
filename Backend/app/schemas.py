from datetime import date
from typing import Optional, List

from pydantic import BaseModel, EmailStr, Field


# ---------- AUTH & USER SCHEMAS ----------
class UserSignup(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str = Field(..., pattern="^(donor|recipient)$")  # Only "donor" or "recipient"
    phone_number: Optional[str] = None
    age: Optional[int] = None
    blood_group: Optional[str] = None
    city: Optional[str] = None
    last_donation_date: Optional[date] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserProfile(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    phone_number: Optional[str] = None
    age: Optional[int] = None
    blood_group: Optional[str] = None
    city: Optional[str] = None
    last_donation_date: Optional[date] = None

    class Config:
        orm_mode = True


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    age: Optional[int] = None
    blood_group: Optional[str] = None
    city: Optional[str] = None
    last_donation_date: Optional[date] = None


class Token(BaseModel):
    access_token: str
    token_type: str


# ---------- HISTORY SCHEMAS ----------
class HistoryEntry(BaseModel):
    id: int
    entry_type: str
    date: date
    hospital: str
    blood_group: str

    class Config:
        orm_mode = True


class HistoryResponse(BaseModel):
    donations: List[HistoryEntry]
    received: List[HistoryEntry]


# ---------- DONOR LIST SCHEMA ----------
class DonorListItem(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    blood_group: str
    city: str
    age: int
    last_donation_date: Optional[date] = None

    class Config:
        orm_mode = True
