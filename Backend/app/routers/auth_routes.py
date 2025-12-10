from datetime import timedelta, date
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app import auth as auth_utils
from app.database import get_db
from app.models import User as UserModel, DonationHistory
from app.schemas import (
    UserSignup,
    UserLogin,
    UserProfile,
    UserProfileUpdate,
    Token,
    HistoryResponse,
    HistoryEntry,
)

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# Lightweight current user model used by other routers
from pydantic import BaseModel


class User(BaseModel):
  id: int
  email: str


def _get_user_from_token(token: str, db: Session) -> UserModel:
  payload = auth_utils.decode_access_token(token)
  if not payload:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid or expired token",
    )
  user_id = payload.get("sub")
  if user_id is None:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid token payload",
    )
  user = db.query(UserModel).filter(UserModel.id == user_id).first()
  if not user:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="User not found",
    )
  return user


async def get_current_user(
  token: str = Depends(oauth2_scheme),
  db: Session = Depends(get_db),
) -> User:
  user = _get_user_from_token(token, db)
  return User(id=user.id, email=user.email)


def get_current_db_user(
  token: str = Depends(oauth2_scheme),
  db: Session = Depends(get_db),
) -> UserModel:
  return _get_user_from_token(token, db)


@router.post("/signup", response_model=UserProfile, status_code=status.HTTP_201_CREATED)
def signup(user_in: UserSignup, db: Session = Depends(get_db)):
  existing = db.query(UserModel).filter(UserModel.email == user_in.email).first()
  if existing:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Email already registered",
    )

  hashed_password = auth_utils.hash_password(user_in.password)

  db_user = UserModel(
    full_name=user_in.full_name,
    email=user_in.email,
    password=hashed_password,
    role=user_in.role,
    phone_number=user_in.phone_number,
    age=user_in.age,
    blood_group=user_in.blood_group,
    city=user_in.city,
    last_donation_date=user_in.last_donation_date,
  )
  db.add(db_user)
  db.commit()
  db.refresh(db_user)

  return db_user


@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
  user = db.query(UserModel).filter(UserModel.email == user_in.email).first()
  if not user:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid email or password",
    )

  if not auth_utils.verify_password(user_in.password, user.password):
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid email or password",
    )

  access_token_expires = timedelta(minutes=auth_utils.ACCESS_TOKEN_EXPIRE_MINUTES)
  access_token = auth_utils.create_access_token(
    data={"sub": user.id}, expires_delta=access_token_expires
  )

  return Token(access_token=access_token, token_type="bearer")


@router.get("/profile", response_model=UserProfile)
def get_profile(current_user: UserModel = Depends(get_current_db_user)):
  return current_user


@router.put("/profile/update", response_model=UserProfile)
def update_profile(
  update_in: UserProfileUpdate,
  db: Session = Depends(get_db),
  current_user: UserModel = Depends(get_current_db_user),
):
  for field, value in update_in.dict(exclude_unset=True).items():
    setattr(current_user, field, value)

  db.add(current_user)
  db.commit()
  db.refresh(current_user)
  return current_user


@router.get("/history", response_model=HistoryResponse)
def get_history(
  db: Session = Depends(get_db),
  current_user: UserModel = Depends(get_current_db_user),
  start_date: Optional[date] = None,
  end_date: Optional[date] = None,
  entry_type: Optional[str] = None,  # "donation" or "received"
):
  query = db.query(DonationHistory).filter(DonationHistory.user_id == current_user.id)

  if entry_type in {"donation", "received"}:
    query = query.filter(DonationHistory.entry_type == entry_type)

  if start_date:
    query = query.filter(DonationHistory.date >= start_date)
  if end_date:
    query = query.filter(DonationHistory.date <= end_date)

  entries: List[DonationHistory] = query.order_by(DonationHistory.date.desc()).all()

  donation_entries = [
    HistoryEntry.from_orm(e) for e in entries if e.entry_type == "donation"
  ]
  received_entries = [
    HistoryEntry.from_orm(e) for e in entries if e.entry_type == "received"
  ]

  return HistoryResponse(donations=donation_entries, received=received_entries)
