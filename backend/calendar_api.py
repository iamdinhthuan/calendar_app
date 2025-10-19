"""
Google Calendar API integration
"""
import os
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from dotenv import load_dotenv

from deps import get_current_user
from db import User, get_refresh_token_for_user
from schemas import EventsListResponse, EventResponse

load_dotenv()

router = APIRouter()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")


def get_credentials(user_id: int) -> Credentials:
    """
    Get Google OAuth credentials for user
    
    Retrieves refresh token from database and creates Credentials object.
    The Credentials object will automatically refresh access token when needed.
    
    Args:
        user_id: User ID
    
    Returns:
        Google Credentials object
    
    Raises:
        HTTPException: If no credentials found for user
    """
    refresh_token = get_refresh_token_for_user(user_id)
    
    if not refresh_token:
        raise HTTPException(
            status_code=401,
            detail="No Google credentials found. Please re-authenticate."
        )
    
    # Create credentials object
    # The credentials will automatically refresh the access token when needed
    creds = Credentials(
        token=None,  # No access token yet, will be refreshed
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        scopes=["https://www.googleapis.com/auth/calendar.readonly"]
    )
    
    return creds


@router.get("/events", response_model=EventsListResponse)
async def list_events(
    timeMin: str,
    timeMax: str,
    timezone: str = "Asia/Bangkok",
    pageToken: Optional[str] = None,
    user: User = Depends(get_current_user)
):
    """
    List calendar events for authenticated user
    
    Args:
        timeMin: RFC3339 timestamp - minimum time for events (inclusive)
        timeMax: RFC3339 timestamp - maximum time for events (exclusive)
        timezone: IANA timezone name (default: Asia/Bangkok)
        pageToken: Token for pagination (optional)
        user: Current authenticated user
    
    Returns:
        List of events with optional pagination token
    
    Raises:
        HTTPException: If credentials invalid or Calendar API fails
    """
    try:
        # Get user credentials
        creds = get_credentials(user.id)
        
        # Build Calendar API service
        service = build("calendar", "v3", credentials=creds)
        
        # Call Calendar API
        request_params = {
            "calendarId": "primary",
            "timeMin": timeMin,
            "timeMax": timeMax,
            "timeZone": timezone,
            "singleEvents": True,
            "orderBy": "startTime",
            "maxResults": 50,  # Limit results per page
        }
        
        if pageToken:
            request_params["pageToken"] = pageToken
        
        events_result = service.events().list(**request_params).execute()
        
        # Extract events
        items = events_result.get("items", [])
        
        # Map to our schema
        mapped_events = []
        for event in items:
            # Get start/end time (could be dateTime or date for all-day events)
            start = event.get("start", {})
            end = event.get("end", {})
            
            start_time = start.get("dateTime") or start.get("date", "")
            end_time = end.get("dateTime") or end.get("date", "")
            
            # Get attendees
            attendees = []
            if event.get("attendees"):
                attendees = [
                    attendee.get("email", "")
                    for attendee in event.get("attendees", [])
                    if attendee.get("email")
                ]
            
            # Get calendar ID
            organizer = event.get("organizer", {})
            calendar_id = organizer.get("email", "primary")
            
            mapped_events.append(EventResponse(
                id=event.get("id", ""),
                summary=event.get("summary"),
                start=start_time,
                end=end_time,
                attendees=attendees,
                calendarId=calendar_id
            ))
        
        # Get next page token if available
        next_page_token = events_result.get("nextPageToken")
        
        return EventsListResponse(
            events=mapped_events,
            nextPageToken=next_page_token
        )
        
    except HttpError as error:
        # Google API error
        raise HTTPException(
            status_code=error.resp.status,
            detail=f"Google Calendar API error: {error._get_reason()}"
        )
    except HTTPException:
        # Re-raise our own exceptions
        raise
    except Exception as e:
        # Unexpected error
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch calendar events: {str(e)}"
        )

