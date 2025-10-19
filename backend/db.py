"""
Database models and operations using SQLModel + SQLite
"""
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Field, SQLModel, create_engine, Session, select
import os
from dotenv import load_dotenv

load_dotenv()

# Models
class User(SQLModel, table=True):
    """User model - stores basic Google account info"""
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    google_sub: str = Field(index=True, unique=True)  # Google's unique user ID
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Credential(SQLModel, table=True):
    """Credential model - stores OAuth refresh tokens"""
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True, unique=True)
    refresh_token: str  # TODO: Encrypt in production with KMS/Fernet
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")
engine = create_engine(DATABASE_URL, echo=False)


def init_db():
    """Initialize database tables"""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Get database session"""
    with Session(engine) as session:
        yield session


# Database operations
def get_or_create_user(email: str, google_sub: str) -> User:
    """
    Get existing user or create new one
    
    Args:
        email: User's email from Google
        google_sub: Google's unique subject identifier
    
    Returns:
        User object
    """
    with Session(engine) as session:
        # Try to find existing user by google_sub
        statement = select(User).where(User.google_sub == google_sub)
        user = session.exec(statement).first()
        
        if user:
            # Update email if changed
            if user.email != email:
                user.email = email
                session.add(user)
                session.commit()
                session.refresh(user)
            return user
        
        # Create new user
        user = User(email=email, google_sub=google_sub)
        session.add(user)
        session.commit()
        session.refresh(user)
        return user


def get_user_by_id(user_id: int) -> Optional[User]:
    """Get user by ID"""
    with Session(engine) as session:
        return session.get(User, user_id)


def save_tokens_for_user(user_id: int, refresh_token: str) -> Credential:
    """
    Save or update refresh token for user
    
    Args:
        user_id: User ID
        refresh_token: Google refresh token
    
    Returns:
        Credential object
    """
    with Session(engine) as session:
        # Check if credential exists
        statement = select(Credential).where(Credential.user_id == user_id)
        credential = session.exec(statement).first()
        
        if credential:
            # Update existing
            credential.refresh_token = refresh_token
            credential.updated_at = datetime.now(timezone.utc)
        else:
            # Create new
            credential = Credential(user_id=user_id, refresh_token=refresh_token)
        
        session.add(credential)
        session.commit()
        session.refresh(credential)
        return credential


def get_refresh_token_for_user(user_id: int) -> Optional[str]:
    """
    Get refresh token for user
    
    Args:
        user_id: User ID
    
    Returns:
        Refresh token string or None
    """
    with Session(engine) as session:
        statement = select(Credential).where(Credential.user_id == user_id)
        credential = session.exec(statement).first()
        return credential.refresh_token if credential else None

