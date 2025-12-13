from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Import all your routers
from app.routers import auth_routes, recipient, donor, stats, history

app = FastAPI(title="Blood Donation System API")

# --- CORS CONFIGURATION ---
# IMPORTANT: This list must contain the exact domains of your frontend applications.
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    
    # 1. Vercel Production Link (Your friend's link)
    "https://blood-donation-oc81cwdga-mahnoor2970-3221s-projects.vercel.app", 
    
    # 2. Ngrok Current Tunnel Link (The public API address)
    "https://unvivid-charles-hematological.ngrok-free.dev",
    
    # (Optional: Old link, you can remove this after confirming the new one works)
    "https://funny-cat-45.loca.lt" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Allow these origins
    allow_credentials=True,
    allow_methods=["*"],         # Allow ALL methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],         # Allow ALL headers (Authorization, Content-Type, etc.)
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