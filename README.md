# Google Calendar OAuth Web Application

Ứng dụng web full-stack để truy cập Google Calendar với OAuth 2.0 authentication.

**Backend**: FastAPI (Python) | **Frontend**: Next.js 14 (TypeScript) + shadcn/ui + Zustand

## Tính năng

- ✅ Đăng nhập với Google OAuth 2.0
- ✅ Xin quyền truy cập Google Calendar (read-only)
- ✅ Lưu refresh token an toàn ở server-side
- ✅ Session-based auth với httpOnly cookies
- ✅ Lọc events theo date range và timezone (Asia/Bangkok)
- ✅ UI hiện đại với shadcn/ui components
- ✅ Loading, error, empty states
- ✅ Responsive design

## Kiến trúc

```
┌─────────────┐         OAuth Flow          ┌──────────────┐
│   Browser   │ ──────────────────────────> │    Google    │
│  (Next.js)  │ <────────────────────────── │   Account    │
└─────────────┘                              └──────────────┘
       │
       │ Session Cookie (httpOnly)
       │
       ▼
┌─────────────┐                              ┌──────────────┐
│   Backend   │ ──── Refresh Token ────────> │   Google     │
│  (FastAPI)  │ <─── Access Token ────────── │ Calendar API │
└─────────────┘                              └──────────────┘
       │
       ▼
┌─────────────┐
│   SQLite    │
│  (Database) │
└─────────────┘
```

**Security**: Token Google chỉ được lưu ở backend. Frontend chỉ có session cookie (httpOnly).

## Google Cloud Setup

### 1. Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Enable **Google Calendar API**:
   - Vào "APIs & Services" > "Library"
   - Tìm "Google Calendar API"
   - Click "Enable"

### 2. Tạo OAuth 2.0 Credentials

1. Vào "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Chọn Application type: **Web application**
4. Đặt tên: `Google Calendar OAuth App`

### 3. Cấu hình OAuth Consent Screen

1. Vào "OAuth consent screen"
2. User Type: **External** (hoặc Internal nếu dùng Google Workspace)
3. Điền thông tin:
   - App name: `Google Calendar OAuth App`
   - User support email: (email của bạn)
   - Developer contact: (email của bạn)
4. Scopes: Thêm scopes sau:
   - `openid`
   - `email`
   - `profile`
   - `https://www.googleapis.com/auth/calendar.readonly`
5. Test users: Thêm email Google của bạn (nếu app ở mode Testing)

### 4. Cấu hình Authorized URLs

**Authorized JavaScript origins:**
```
http://localhost:3000
```

**Authorized redirect URIs:**
```
http://localhost:8000/auth/callback
```

### 5. Lấy Credentials

Sau khi tạo xong, bạn sẽ nhận được:
- **Client ID**: `xxxxx.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxx`

Lưu 2 giá trị này để cấu hình backend.

## Local Development Setup

### Prerequisites

- Python 3.9+
- Node.js 18+
- pnpm (hoặc npm/yarn)

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/Mac
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp env.template .env

# Edit .env với Google credentials của bạn
# GOOGLE_CLIENT_ID=your_client_id
# GOOGLE_CLIENT_SECRET=your_client_secret
# SESSION_SECRET=$(python -c "import secrets; print(secrets.token_urlsafe(32))")

# 5. Run server
uvicorn app:app --reload --port 8000
```

Backend sẽ chạy tại: `http://localhost:8000`

API Docs: `http://localhost:8000/docs`

### Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
pnpm install

# 3. Configure environment
cp env.template .env.local

# Edit .env.local
# NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# 4. Run dev server
pnpm dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

### Testing Backend

```bash
cd backend
pytest test_api.py -v
```

## Usage Flow

1. Mở browser: `http://localhost:3000`
2. Click "Sign in with Google"
3. Đăng nhập Google và cho phép access Calendar
4. Được redirect về `/dashboard`
5. Chọn date range (This Week, This Month, Next Week)
6. Click "Fetch Events" để xem calendar events
7. Click "Logout" để đăng xuất

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLModel**: ORM với SQLite
- **google-auth**: Google OAuth library
- **google-api-python-client**: Google Calendar API
- **python-jose**: JWT cho session tokens
- **httpx**: HTTP client
- **pytest**: Testing

### Frontend
- **Next.js 14**: React framework với App Router
- **TypeScript**: Type safety
- **shadcn/ui**: Re-usable UI components
- **Tailwind CSS**: Utility-first CSS
- **Zustand**: State management
- **date-fns**: Date utilities
- **lucide-react**: Icons

## Project Structure

```
.
├── backend/
│   ├── app.py              # FastAPI main app
│   ├── auth.py             # OAuth endpoints
│   ├── google.py           # Calendar API integration
│   ├── db.py               # Database models
│   ├── utils.py            # Auth utilities
│   ├── deps.py             # Dependencies
│   ├── schemas.py          # Pydantic schemas
│   ├── test_api.py         # Tests
│   ├── requirements.txt    # Python deps
│   └── README.md
│
├── frontend/
│   ├── app/                # Next.js pages
│   ├── components/         # React components
│   ├── lib/                # Utilities
│   ├── package.json
│   └── README.md
│
└── README.md              # This file
```

## API Endpoints

### Authentication
- `GET /auth/login` - Get Google OAuth URL
- `GET /auth/callback` - OAuth callback handler
- `POST /auth/logout` - Logout (clear session)
- `GET /auth/me` - Get current user info

### Google Calendar
- `GET /api/events` - List calendar events
  - Query params: `timeMin`, `timeMax`, `timezone`, `pageToken`

### Health
- `GET /healthz` - Health check

## Security Notes

### ✅ Best Practices

- Refresh tokens lưu server-side only
- Session cookies với `httpOnly`, `SameSite=Lax`
- OAuth state verification (CSRF protection)
- CORS configured strictly
- No tokens exposed to client

### ⚠️ Production Recommendations

1. **Encryption**: Mã hóa refresh tokens trong DB (Fernet/KMS)
2. **HTTPS**: Bật `Secure` cookie flag
3. **Database**: Dùng PostgreSQL thay vì SQLite
4. **OAuth State**: Dùng Redis thay vì in-memory dict
5. **Rate Limiting**: Add rate limiter
6. **Logging**: Add structured logging
7. **Monitoring**: Add error tracking (Sentry)

## Troubleshooting

### "Invalid state parameter"
→ Thử refresh lại trang `/` và login lại. State có thể đã expire (10 phút).

### "No Google credentials found"
→ User cần đăng nhập lại. Backend cần refresh token từ Google (chỉ cấp lần đầu hoặc với `prompt=consent`).

### CORS errors
→ Kiểm tra `FRONTEND_ORIGIN` trong backend `.env` khớp với frontend URL.

### 401 Unauthorized on `/api/events`
→ Session cookie không được gửi hoặc đã expire. Login lại.

### Events không hiển thị
→ Kiểm tra bạn có events trong Calendar trong date range đã chọn. Thử chọn "This Month".

## Publishing to Production

### Quick Start:

App đã có đầy đủ trang cần thiết để publish:
- ✅ **Privacy Policy**: `/privacy`
- ✅ **Terms of Service**: `/terms`
- ✅ **About Page**: `/about`
- ✅ **Homepage**: `/`

### Bước 1: Deploy App

**Frontend (Vercel - Miễn phí):**
```bash
# Push to GitHub
git init && git add . && git commit -m "Initial"
git push

# Deploy on Vercel
# Visit: vercel.com → Import từ GitHub
# Auto-detect Next.js, chọn root: frontend/
```

**Backend (Fly.io hoặc Render):**
```bash
# Chi tiết xem DEPLOYMENT.md
fly launch
fly secrets set GOOGLE_CLIENT_ID=...
fly deploy
```

### Bước 2: Update Google Cloud Console

**OAuth Client ID:**
```
Authorized redirect URIs:
  https://your-app.vercel.app/auth/callback
```

**OAuth Consent Screen:**
```
App homepage:        https://your-app.vercel.app
Privacy policy URL:  https://your-app.vercel.app/privacy
Terms of service:    https://your-app.vercel.app/terms
```

### Bước 3: Publish App

1. Vào: https://console.cloud.google.com/apis/credentials/consent
2. Click **"PUBLISH APP"**
3. Confirm

➡️ **Done!** App có thể dùng cho unlimited users! 🎉

**Lưu ý**: Với Calendar scope (sensitive), Google có thể review app (1-2 tuần). Trong khi chờ, app vẫn hoạt động ở Testing mode với Test users.

📖 **Chi tiết deployment**: Xem [DEPLOYMENT.md](DEPLOYMENT.md)

## License

MIT

## Contributing

Pull requests welcome! Vui lòng tạo issue trước khi implement feature lớn.

## Support

Nếu gặp vấn đề, tạo issue trên GitHub hoặc liên hệ qua email.

---

Made with ❤️ using FastAPI + Next.js

