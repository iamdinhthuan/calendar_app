"""
Utility functions for OAuth, JWT, and session management
"""
import os
import secrets
import time
from typing import Optional, Dict, Any
from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode

from jose import jwt, JWTError
from fastapi import Response, HTTPException
from dotenv import load_dotenv
import httpx

load_dotenv()

# Configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
OAUTH_REDIRECT_URI = os.getenv("OAUTH_REDIRECT_URI")
SESSION_SECRET = os.getenv("SESSION_SECRET", "dev-secret-change-in-production")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

# OAuth state storage (in-memory for demo - use Redis in production)
oauth_states: Dict[str, float] = {}  # state -> timestamp

# OAuth endpoints
GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


def generate_state() -> str:
    """
    Generate random OAuth state and store it
    
    Returns:
        Random state string
    """
    state = secrets.token_urlsafe(32)
    oauth_states[state] = time.time()
    
    # Clean up old states (older than 10 minutes)
    cutoff = time.time() - 600
    expired = [s for s, ts in oauth_states.items() if ts < cutoff]
    for s in expired:
        del oauth_states[s]
    
    return state


def verify_state(state: str) -> bool:
    """
    Verify OAuth state exists and is valid
    
    Args:
        state: State to verify
    
    Returns:
        True if valid, False otherwise
    """
    if state not in oauth_states:
        return False
    
    # Check if not expired (10 minutes max)
    if time.time() - oauth_states[state] > 600:
        del oauth_states[state]
        return False
    
    # Remove state after use (one-time use)
    del oauth_states[state]
    return True


def build_auth_url(state: str) -> str:
    """
    Build Google OAuth authorization URL
    
    Args:
        state: OAuth state for CSRF protection
    
    Returns:
        Full authorization URL
    """
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": OAUTH_REDIRECT_URI,
        "response_type": "code",
        "scope": " ".join([
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/calendar.readonly"
        ]),
        "state": state,
        "access_type": "offline",  # Get refresh token
        "prompt": "consent",  # Force consent to get refresh token every time
    }
    return f"{GOOGLE_AUTH_URL}?{urlencode(params)}"


async def exchange_code_for_tokens(code: str) -> tuple[Dict[str, Any], Dict[str, Any]]:
    """
    Exchange authorization code for tokens
    
    Args:
        code: Authorization code from callback
    
    Returns:
        Tuple of (tokens dict, user info dict)
    
    Raises:
        HTTPException: If token exchange fails
    """
    async with httpx.AsyncClient() as client:
        # Exchange code for tokens
        token_data = {
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": OAUTH_REDIRECT_URI,
            "grant_type": "authorization_code",
        }
        
        token_response = await client.post(GOOGLE_TOKEN_URL, data=token_data)
        
        if token_response.status_code != 200:
            error_detail = token_response.text
            try:
                error_json = token_response.json()
                error_detail = error_json.get("error_description", error_json.get("error", error_detail))
            except:
                pass
            raise HTTPException(
                status_code=400, 
                detail=f"Failed to exchange code for tokens: {error_detail}"
            )
        
        tokens = token_response.json()
        
        # Get user info using access token
        userinfo_response = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {tokens['access_token']}"}
        )
        
        if userinfo_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get user info")
        
        userinfo = userinfo_response.json()
        
        return tokens, userinfo


def create_session_jwt(user_id: int) -> str:
    """
    Create JWT session token
    
    Args:
        user_id: User ID to encode
    
    Returns:
        JWT token string
    """
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, SESSION_SECRET, algorithm="HS256")


def verify_session_jwt(token: str) -> Optional[int]:
    """
    Verify and decode JWT session token
    
    Args:
        token: JWT token string
    
    Returns:
        User ID if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, SESSION_SECRET, algorithms=["HS256"])
        user_id = payload.get("sub")
        return int(user_id) if user_id else None
    except JWTError:
        return None


def create_session_cookie(response: Response, user_id: int):
    """
    Set session cookie on response
    
    Args:
        response: FastAPI Response object
        user_id: User ID to encode in session
    """
    token = create_session_jwt(user_id)
    
    # For development: cookies work same-origin via Next.js proxy
    # SameSite=lax is secure and works for top-level navigation
    response.set_cookie(
        key="session",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,  # Set to True in production with HTTPS
        max_age=7 * 24 * 60 * 60,  # 7 days
        path="/",
        # Don't set domain - let browser use current origin
    )


def clear_session_cookie(response: Response):
    """
    Clear session cookie
    
    Args:
        response: FastAPI Response object
    """
    response.delete_cookie(key="session", path="/")

