"""
Pydantic schemas for request/response validation
"""
from typing import Optional, List
from pydantic import BaseModel


class EventResponse(BaseModel):
    """Single calendar event response"""
    id: str
    summary: Optional[str] = None
    start: str
    end: str
    attendees: List[str] = []
    calendarId: str


class EventsListResponse(BaseModel):
    """List of calendar events with pagination"""
    events: List[EventResponse]
    nextPageToken: Optional[str] = None


class UserResponse(BaseModel):
    """User information response"""
    email: str
    id: int


class AuthUrlResponse(BaseModel):
    """OAuth authorization URL response"""
    auth_url: str


class LogoutResponse(BaseModel):
    """Logout response"""
    ok: bool

