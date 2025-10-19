"""
Tests for backend API endpoints
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

from app import app
from utils import build_auth_url, generate_state, verify_state
from db import init_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    """Setup test database"""
    init_db()
    yield


def test_healthz():
    """Test health check endpoint"""
    response = client.get("/healthz")
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True
    assert "timestamp" in data


def test_build_auth_url():
    """Test OAuth URL builder includes correct scopes"""
    state = "test_state_123"
    auth_url = build_auth_url(state)
    
    # Check URL contains required components
    assert "accounts.google.com/o/oauth2/v2/auth" in auth_url
    assert "calendar.readonly" in auth_url
    assert "openid" in auth_url
    assert "email" in auth_url
    assert f"state={state}" in auth_url
    assert "access_type=offline" in auth_url


def test_state_generation_and_verification():
    """Test OAuth state generation and verification"""
    # Generate state
    state = generate_state()
    assert state is not None
    assert len(state) > 20
    
    # Verify state (should succeed once)
    assert verify_state(state) is True
    
    # Verify again (should fail - one-time use)
    assert verify_state(state) is False
    
    # Verify invalid state
    assert verify_state("invalid_state") is False


def test_login_endpoint():
    """Test /auth/login returns auth URL"""
    response = client.get("/auth/login")
    assert response.status_code == 200
    data = response.json()
    assert "auth_url" in data
    assert "accounts.google.com" in data["auth_url"]


def test_logout_endpoint():
    """Test /auth/logout clears session"""
    response = client.post("/auth/logout")
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True


def test_me_endpoint_without_auth():
    """Test /auth/me requires authentication"""
    response = client.get("/auth/me")
    assert response.status_code == 401
    assert "Not authenticated" in response.json()["detail"]


def test_events_endpoint_without_auth():
    """Test /api/events requires authentication"""
    response = client.get("/api/events?timeMin=2025-01-01T00:00:00Z&timeMax=2025-01-31T23:59:59Z")
    assert response.status_code == 401


@patch("auth.exchange_code_for_tokens")
def test_callback_with_invalid_state(mock_exchange):
    """Test callback rejects invalid state"""
    response = client.get("/auth/callback?code=test_code&state=invalid_state")
    assert response.status_code == 400
    assert "Invalid or expired state" in response.json()["detail"]


@patch("auth.exchange_code_for_tokens")
@patch("auth.get_or_create_user")
@patch("auth.save_tokens_for_user")
def test_callback_success_flow(mock_save_tokens, mock_get_user, mock_exchange):
    """Test successful OAuth callback flow"""
    # Setup mocks
    mock_exchange.return_value = (
        {"access_token": "test_access", "refresh_token": "test_refresh"},
        {"email": "test@example.com", "sub": "123456"}
    )
    
    mock_user = MagicMock()
    mock_user.id = 1
    mock_user.email = "test@example.com"
    mock_get_user.return_value = mock_user
    
    # Generate valid state
    state = generate_state()
    
    # Make request
    response = client.get(f"/auth/callback?code=test_code&state={state}", follow_redirects=False)
    
    # Should redirect to frontend
    assert response.status_code == 302
    assert "/dashboard" in response.headers["location"]
    
    # Should set session cookie
    assert "session" in response.cookies


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

