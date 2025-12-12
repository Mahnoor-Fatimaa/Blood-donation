from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from pydantic import BaseModel
from typing import Optional

from app.database import get_db
from app.models import User as UserModel
from app.auth import (
    verify_password, 
    hash_password, 
    create_access_token, 
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter()

# --- SCHEMAS ---
class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    role: str = "donor"
    phone_number: str = None
    age: int = None
    blood_group: str = None
    city: str = None

# FIX: New Schema for Updates (all fields optional)
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    age: Optional[int] = None
    blood_group: Optional[str] = None
    city: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# --- 1. SIGNUP ---
@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(UserModel).filter(UserModel.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)
    new_user = UserModel(
        full_name=user.full_name,
        email=user.email,
        password=hashed_pw,
        role=user.role,
        phone_number=user.phone_number,
        age=user.age,
        blood_group=user.blood_group,
        city=user.city
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {"id": new_user.id, "email": new_user.email, "full_name": new_user.full_name, "role": new_user.role}
    }

# --- 2. LOGIN ---
@router.post("/login", response_model=Token)
def login(form_data: dict, db: Session = Depends(get_db)):
    email = form_data.get("email")
    password = form_data.get("password")

    user = db.query(UserModel).filter(UserModel.email == email).first()
    
    if not user or not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "full_name": user.full_name, "role": user.role}
    }

# --- 3. GET PROFILE ---
@router.get("/profile")
def read_users_me(current_user: UserModel = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role,
        "phone_number": current_user.phone_number,
        "age": current_user.age,
        "blood_group": current_user.blood_group,
        "city": current_user.city
    }

# --- 4. UPDATE PROFILE (FIX ADDED HERE) ---
@router.put("/profile/update")
def update_profile(
    user_data: UserUpdate, 
    db: Session = Depends(get_db), 
    current_user: UserModel = Depends(get_current_user)
):
    # Only update fields that are sent
    if user_data.full_name: 
        current_user.full_name = user_data.full_name
    if user_data.phone_number: 
        current_user.phone_number = user_data.phone_number
    if user_data.age: 
        current_user.age = user_data.age
    if user_data.blood_group: 
        current_user.blood_group = user_data.blood_group
    if user_data.city: 
        current_user.city = user_data.city
    
    db.commit()
    db.refresh(current_user)
    
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "phone_number": current_user.phone_number,
        "age": current_user.age,
        "blood_group": current_user.blood_group,
        "city": current_user.city
    }