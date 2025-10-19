# Quick Start Guide

Hướng dẫn nhanh để chạy Google Calendar OAuth App trong 10 phút.

## Bước 1: Google Cloud Setup (5 phút)

### 1.1. Tạo Project

1. Truy cập: https://console.cloud.google.com/
2. Tạo project mới: "Calendar OAuth App"
3. Select project vừa tạo

### 1.2. Enable Calendar API

1. Vào "APIs & Services" > "Library"
2. Tìm "Google Calendar API"
3. Click "Enable"

### 1.3. OAuth Consent Screen

1. Vào "APIs & Services" > "OAuth consent screen"
2. Chọn **External** > Create
3. Điền:
   - App name: `Calendar OAuth App`
   - User support email: (email của bạn)
   - Developer contact: (email của bạn)
4. Click "Save and Continue"
5. Scopes > "Add or Remove Scopes":
   - Tìm và check: `.../auth/calendar.readonly`
   - Hoặc paste: `https://www.googleapis.com/auth/calendar.readonly`
6. Click "Save and Continue"
7. Test users > "Add Users" > thêm email Google của bạn
8. Click "Save and Continue"

### 1.4. Create OAuth Client

1. Vào "APIs & Services" > "Credentials"
2. "Create Credentials" > "OAuth client ID"
3. Application type: **Web application**
4. Name: `Local Dev Client`
5. Authorized JavaScript origins:
   ```
   http://localhost:3000
   ```
6. Authorized redirect URIs:
   ```
   http://localhost:8000/auth/callback
   ```
7. Click "Create"
8. **Copy Client ID và Client Secret** (cần cho bước sau)

## Bước 2: Backend Setup (2 phút)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Activate (Linux/Mac)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp env.template .env
```

**Edit `backend/.env`:**

```env
GOOGLE_CLIENT_ID=paste_your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
OAUTH_REDIRECT_URI=http://localhost:8000/auth/callback
FRONTEND_ORIGIN=http://localhost:3000
SESSION_SECRET=your_random_string_min_32_chars
DATABASE_URL=sqlite:///./app.db
```

**Generate SESSION_SECRET:**

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy output và paste vào `.env`

**Start backend:**

```bash
uvicorn app:app --reload --port 8000
```

✅ Backend chạy tại: http://localhost:8000

## Bước 3: Frontend Setup (2 phút)

**Mở terminal mới:**

```bash
# Navigate to frontend
cd frontend

# Install pnpm (nếu chưa có)
npm install -g pnpm

# Install dependencies
pnpm install

# Create .env.local
cp env.template .env.local
```

**Edit `frontend/.env.local`:**

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

**Start frontend:**

```bash
pnpm dev
```

✅ Frontend chạy tại: http://localhost:3000

## Bước 4: Test App (1 phút)

1. Mở browser: http://localhost:3000
2. Click **"Sign in with Google"**
3. Chọn Google account (phải là email đã add vào Test users)
4. Click "Continue" (app chưa verified, normal)
5. Cho phép các quyền Calendar
6. Được redirect về Dashboard
7. Click **"This Week"** > **"Fetch Events"**
8. Xem calendar events hiển thị!

## Troubleshooting

### "Access blocked: This app's request is invalid"

→ Kiểm tra Authorized redirect URIs trong Google Cloud Console có chính xác:
```
http://localhost:8000/auth/callback
```

### "Invalid state parameter"

→ Refresh trang và thử lại. State bị expire.

### Backend không start

→ Kiểm tra virtual environment đã activate và .env đã điền đúng.

### Frontend không start

→ Chạy:
```bash
rm -rf .next node_modules
pnpm install
pnpm dev
```

### No events hiển thị

→ Bạn có events trong Calendar không? Thử chọn "This Month" để expand date range.

## Next Steps

- Đọc [README.md](README.md) để hiểu architecture
- Xem [backend/README.md](backend/README.md) để hiểu backend API
- Xem [frontend/README.md](frontend/README.md) để customize UI
- Chạy tests: `cd backend && pytest test_api.py -v`

## Production Deployment

Khi deploy production:

1. Update Google Cloud Console với production URLs
2. Set `Secure=True` cho cookies (HTTPS only)
3. Dùng PostgreSQL thay vì SQLite
4. Mã hóa refresh tokens
5. Add rate limiting
6. Enable monitoring/logging

Happy coding! 🚀

