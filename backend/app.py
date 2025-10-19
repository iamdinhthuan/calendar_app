"""
Main FastAPI application
"""
import os
from datetime import datetime, timezone
from fastapi import FastAPI, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from db import init_db
from auth import router as auth_router
from calendar_api import router as google_router

load_dotenv()

# Configuration
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

# Create FastAPI app
app = FastAPI(
    title="Google Calendar OAuth API",
    description="Backend API for Google Calendar integration with OAuth2",
    version="1.0.0"
)

# CORS middleware - allow frontend to make authenticated requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,  # Allow cookies
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()
    print("✓ Database initialized")
    print(f"✓ CORS enabled for: {FRONTEND_ORIGIN}")


@app.get("/healthz")
async def healthz():
    """
    Health check endpoint
    
    Returns:
        Status and current timestamp
    """
    return {
        "ok": True,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "google-calendar-oauth-api"
    }


@app.get("/debug/set-cookie")
async def debug_set_cookie(response: Response):
    """Debug endpoint to test cookie setting"""
    from utils import create_session_cookie
    create_session_cookie(response, user_id=999)
    return {"message": "Cookie set with user_id=999"}


@app.get("/debug/check-cookie")
async def debug_check_cookie(request: Request):
    """Debug endpoint to check if cookie is received"""
    session_cookie = request.cookies.get("session")
    return {
        "has_cookie": session_cookie is not None,
        "cookie_value": session_cookie[:20] + "..." if session_cookie else None,
        "all_cookies": list(request.cookies.keys())
    }


@app.get("/debug/config")
async def debug_config():
    """Debug endpoint to check environment config"""
    import os
    return {
        "OAUTH_REDIRECT_URI": os.getenv("OAUTH_REDIRECT_URI"),
        "FRONTEND_ORIGIN": os.getenv("FRONTEND_ORIGIN"),
        "GOOGLE_CLIENT_ID": os.getenv("GOOGLE_CLIENT_ID", "")[:20] + "...",
        "HAS_CLIENT_SECRET": bool(os.getenv("GOOGLE_CLIENT_SECRET")),
    }


@app.get("/admin/users")
async def list_all_users():
    """
    Admin endpoint to list all registered users
    
    Note: In production, protect this with admin authentication
    """
    from db import User
    from sqlmodel import Session, select
    from db import engine
    
    with Session(engine) as session:
        statement = select(User).order_by(User.created_at.desc())
        users = session.exec(statement).all()
        
        return {
            "total_users": len(users),
            "users": [
                {
                    "id": user.id,
                    "email": user.email,
                    "created_at": user.created_at.isoformat(),
                }
                for user in users
            ]
        }


# Include routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(google_router, prefix="/api", tags=["Google Calendar"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

