from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# 1. Added stats and history to the imports
from app.routers import auth_routes, recipient, donor, stats, history

app = FastAPI(title="Blood Donation System API")

# Allow frontend (Vite)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
app.include_router(recipient.router, prefix="/recipient", tags=["recipients"])
app.include_router(donor.router, prefix="/donor", tags=["donors"])

# 2. Included the new routers here
app.include_router(stats.router, prefix="/stats", tags=["stats"])
app.include_router(history.router, prefix="/history", tags=["history"])

@app.get("/")
def root():
    return {"message": "Blood Donation System API", "status": "running"}