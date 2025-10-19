"""
Authentication endpoints for OAuth flow
"""
import os
from fastapi import APIRouter, Request, Response, HTTPException, Depends
from fastapi.responses import RedirectResponse, HTMLResponse
from dotenv import load_dotenv

from utils import (
    generate_state,
    verify_state,
    build_auth_url,
    exchange_code_for_tokens,
    create_session_cookie,
    clear_session_cookie,
)
from db import get_or_create_user, save_tokens_for_user
from deps import get_current_user
from schemas import AuthUrlResponse, UserResponse, LogoutResponse

load_dotenv()

router = APIRouter()

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")


@router.get("/login", response_model=AuthUrlResponse)
async def login():
    """
    Initiate OAuth login flow
    
    Returns:
        Authorization URL to redirect user to Google consent screen
    """
    # Generate state for CSRF protection
    state = generate_state()
    
    # Build Google OAuth URL
    auth_url = build_auth_url(state)
    
    return {"auth_url": auth_url}


@router.get("/callback", response_class=HTMLResponse)
async def callback(
    code: str,
    state: str,
    response: Response
):
    """
    OAuth callback handler
    
    Exchanges authorization code for tokens, creates/updates user,
    and sets session cookie
    
    Args:
        code: Authorization code from Google
        state: CSRF state token
        response: FastAPI response object
    
    Returns:
        HTML page with JavaScript redirect (allows cookie to be set)
    
    Raises:
        HTTPException: If state is invalid or token exchange fails
    """
    # Verify state (CSRF protection)
    if not verify_state(state):
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired state parameter"
        )
    
    # Exchange code for tokens
    try:
        tokens, userinfo = await exchange_code_for_tokens(code)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to exchange authorization code: {str(e)}"
        )
    
    # Extract user information
    email = userinfo.get("email")
    google_sub = userinfo.get("sub")
    
    if not email or not google_sub:
        raise HTTPException(
            status_code=400,
            detail="Failed to get user information from Google"
        )
    
    # Get or create user
    user = get_or_create_user(email=email, google_sub=google_sub)
    
    # Save refresh token (only if present - Google returns it on first auth or with prompt=consent)
    refresh_token = tokens.get("refresh_token")
    if refresh_token:
        save_tokens_for_user(user.id, refresh_token)
    
    # Create session cookie
    create_session_cookie(response, user.id)
    
    # Return HTML with JavaScript redirect to allow cookie to be set
    dashboard_url = f"{FRONTEND_ORIGIN}/dashboard"
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Redirecting...</title>
        <meta charset="utf-8">
    </head>
    <body>
        <p>Authentication successful! Redirecting...</p>
        <script>
            window.location.href = "{dashboard_url}";
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)


@router.post("/exchange")
async def exchange(
    code: str,
    state: str,
    response: Response
):
    """
    Exchange authorization code for session (called by frontend)
    
    Frontend receives code from Google, sends it here to get session cookie
    
    Args:
        code: Authorization code from Google
        state: CSRF state token
        response: FastAPI response object
    
    Returns:
        Success message
    
    Raises:
        HTTPException: If state is invalid or token exchange fails
    """
    # Verify state (CSRF protection)
    if not verify_state(state):
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired state parameter"
        )
    
    # Exchange code for tokens
    try:
        tokens, userinfo = await exchange_code_for_tokens(code)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to exchange authorization code: {str(e)}"
        )
    
    # Extract user information
    email = userinfo.get("email")
    google_sub = userinfo.get("sub")
    
    if not email or not google_sub:
        raise HTTPException(
            status_code=400,
            detail="Failed to get user information from Google"
        )
    
    # Get or create user
    user = get_or_create_user(email=email, google_sub=google_sub)
    
    # Save refresh token
    refresh_token = tokens.get("refresh_token")
    if refresh_token:
        save_tokens_for_user(user.id, refresh_token)
    
    # Create session cookie
    create_session_cookie(response, user.id)
    
    return {"ok": True, "message": "Authentication successful"}


@router.post("/logout", response_model=LogoutResponse)
async def logout(response: Response):
    """
    Logout user by clearing session cookie
    
    Args:
        response: FastAPI response object
    
    Returns:
        Success status
    """
    clear_session_cookie(response)
    return {"ok": True}


@router.get("/me", response_model=UserResponse)
async def get_me(user = Depends(get_current_user)):
    """
    Get current authenticated user information
    
    Args:
        user: Current user from dependency
    
    Returns:
        User information
    """
    return {"email": user.email, "id": user.id}

