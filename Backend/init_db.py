from app.database import engine
# Importing models ensures they are registered with SQLAlchemy before we create tables
from app.models import Base

def init_db():
    print("⏳ Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")

if __name__ == "__main__":
    init_db()