"""
FastAPI dependencies for authentication and authorization
"""
from typing import Optional
from fastapi import Cookie, HTTPException, Depends
from db import get_user_by_id, User
from utils import verify_session_jwt


async def get_current_user(session: Optional[str] = Cookie(None)) -> User:
    """
    Dependency to get current authenticated user from session cookie
    
    Args:
        session: Session JWT from cookie
    
    Returns:
        User object
    
    Raises:
        HTTPException: 401 if not authenticated or invalid session
    """
    if not session:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated - no session cookie"
        )
    
    # Verify JWT and extract user_id
    user_id = verify_session_jwt(session)
    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired session"
        )
    
    # Get user from database
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )
    
    return user

