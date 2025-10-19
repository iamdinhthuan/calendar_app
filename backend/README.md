# Backend - Google Calendar OAuth API

FastAPI backend cho ứng dụng Google Calendar với OAuth2 authentication.

## Yêu cầu

- Python 3.9+
- Google Cloud Console project với OAuth 2.0 credentials

## Cài đặt

### 1. Tạo Virtual Environment

```bash
cd backend
python -m venv .venv
```

### 2. Kích hoạt Virtual Environment

**Windows:**
```bash
.venv\Scripts\activate
```

**Linux/Mac:**
```bash
source .venv/bin/activate
```

### 3. Cài đặt Dependencies

```bash
pip install -r requirements.txt
```

### 4. Cấu hình Environment Variables

Copy file template và điền thông tin:

```bash
cp env.template .env
```

Chỉnh sửa `.env`:

```env
GOOGLE_CLIENT_ID=your_actual_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_actual_client_secret
OAUTH_REDIRECT_URI=http://localhost:8000/auth/callback
FRONTEND_ORIGIN=http://localhost:3000
SESSION_SECRET=generate_a_random_string_at_least_32_characters_long
DATABASE_URL=sqlite:///./app.db
```

**Lưu ý:** SESSION_SECRET nên là chuỗi ngẫu nhiên dài. Có thể tạo bằng:

```python
import secrets
print(secrets.token_urlsafe(32))
```

## Chạy Development Server

```bash
uvicorn app:app --reload --port 8000
```

Server sẽ chạy tại: `http://localhost:8000`

API documentation (Swagger): `http://localhost:8000/docs`

## Chạy Tests

```bash
pytest test_api.py -v
```

Hoặc với coverage:

```bash
pytest test_api.py -v --cov=. --cov-report=html
```

## API Endpoints

### Authentication

- `GET /auth/login` - Lấy Google OAuth URL
- `GET /auth/callback` - OAuth callback handler
- `POST /auth/logout` - Đăng xuất (xóa session)
- `GET /auth/me` - Lấy thông tin user hiện tại (yêu cầu auth)

### Google Calendar

- `GET /api/events` - Lấy danh sách sự kiện Calendar (yêu cầu auth)
  - Query params: `timeMin`, `timeMax`, `timezone`, `pageToken`

### Health Check

- `GET /healthz` - Kiểm tra trạng thái server

## Cấu trúc Project

```
backend/
├── app.py              # Main FastAPI application
├── auth.py             # Authentication endpoints
├── google.py           # Google Calendar integration
├── deps.py             # FastAPI dependencies
├── db.py               # Database models & operations
├── utils.py            # Utility functions (OAuth, JWT)
├── schemas.py          # Pydantic schemas
├── test_api.py         # Tests
├── requirements.txt    # Python dependencies
├── env.template        # Environment variables template
└── README.md          # This file
```

## Database

Sử dụng SQLite (local) với 2 bảng:

- **User**: Lưu thông tin user từ Google (email, google_sub)
- **Credential**: Lưu refresh tokens (liên kết với User)

Database file sẽ tự động tạo khi chạy lần đầu: `app.db`

## Security Notes

- ✓ Refresh tokens được lưu trong database (server-side only)
- ✓ Session sử dụng JWT trong httpOnly cookie
- ✓ CORS được cấu hình chặt chẽ cho frontend origin
- ✓ OAuth state được verify để chống CSRF
- ⚠️ Trong production:
  - Mã hóa refresh tokens (Fernet/KMS)
  - Dùng Redis thay vì in-memory cho OAuth states
  - Set `secure=True` cho cookies (HTTPS)
  - Dùng PostgreSQL thay vì SQLite

## Troubleshooting

### Lỗi "No Google credentials found"

→ User cần đăng nhập lại để cấp refresh token. Đảm bảo `prompt=consent` trong OAuth URL.

### Lỗi CORS

→ Kiểm tra `FRONTEND_ORIGIN` trong `.env` khớp với frontend URL.

### Database locked

→ SQLite không hỗ trợ concurrent writes tốt. Dùng PostgreSQL cho production.

