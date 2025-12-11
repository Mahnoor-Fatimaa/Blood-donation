from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Replace password and database name if needed
DATABASE_URL = "postgresql://postgres:mypassword123@127.0.0.1:5432/blood_donation"

# Create engine
engine = create_engine(DATABASE_URL)

# Session maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Automatically create tables
Base.metadata.create_all(bind=engine)
