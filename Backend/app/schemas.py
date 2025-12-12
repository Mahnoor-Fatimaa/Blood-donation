from datetime import date
from typing import Optional, List
from pydantic import BaseModel, EmailStr

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[int] = None

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "donor"  # "donor" or "recipient"
    phone_number: Optional[str] = None
    age: Optional[int] = None
    blood_group: Optional[str] = None
    city: Optional[str] = None
    last_donation_date: Optional[date] = None

class UserSignup(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(UserBase):
    id: int
    is_active: bool = True  # Added default

    class Config:
        from_attributes = True  # <--- FIX: Renamed from orm_mode

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    age: Optional[int] = None
    blood_group: Optional[str] = None
    city: Optional[str] = None
    last_donation_date: Optional[date] = None

# --- Donor Schemas ---
class DonorListItem(BaseModel):
    id: int
    full_name: str
    email: str
    blood_group: str
    city: str
    age: int
    last_donation_date: Optional[date] = None

    class Config:
        from_attributes = True  # <--- FIX: Renamed from orm_mode

# --- History Schemas ---
class HistoryEntry(BaseModel):
    id: int
    hospital: str
    blood_group: str
    date: date
    entry_type: str

    class Config:
        from_attributes = True  # <--- FIX: Renamed from orm_mode

class HistoryResponse(BaseModel):
    donations: List[HistoryEntry]
    received: List[HistoryEntry]