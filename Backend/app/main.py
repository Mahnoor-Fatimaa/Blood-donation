from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Import all your routers
from app.routers import auth_routes, recipient, donor, stats, history

app = FastAPI(title="Blood Donation System API")

# --- CORS CONFIGURATION ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://your-vercel-app.vercel.app",
    "https://funny-cat-45.loca.lt" # Add the Localtunnel URL just in case
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # Allow these origins
    allow_credentials=True,
    allow_methods=["*"],          # Allow ALL methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],          # Allow ALL headers
)

# --- REGISTER ROUTERS ---
app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
app.include_router(recipient.router, prefix="/recipient", tags=["recipients"])
app.include_router(donor.router, prefix="/donor", tags=["donors"])
app.include_router(stats.router, prefix="/stats", tags=["stats"])
app.include_router(history.router, prefix="/history", tags=["history"])

@app.get("/")
def root():
    return {"message": "Blood Donation System API is Running", "status": "ok"}