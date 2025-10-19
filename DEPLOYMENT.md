# Hướng dẫn Deploy lên Production

Để publish app lên Production và pass Google verification, bạn cần deploy app và có public URLs.

## Option 1: Deploy lên Vercel (Recommended - Miễn phí)

### Frontend (Next.js) - Vercel

1. **Push code lên GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create google-calendar-oauth --public
   git push -u origin main
   ```

2. **Deploy lên Vercel**
   - Vào: https://vercel.com
   - Click "Import Project"
   - Chọn repository GitHub của bạn
   - Framework preset: **Next.js**
   - Root Directory: `frontend`
   - Build Command: `pnpm build`
   - Output Directory: (để trống, Next.js auto)
   - Install Command: `pnpm install`
   
3. **Environment Variables trên Vercel**
   - Không cần set `NEXT_PUBLIC_BACKEND_URL` (dùng rewrites)
   - Hoặc set: `NEXT_PUBLIC_BACKEND_URL=https://your-backend.fly.dev`

4. **Deploy**
   - Click "Deploy"
   - Vercel sẽ tạo URL: `https://your-app.vercel.app`

### Backend (FastAPI) - Fly.io / Render

#### Option A: Fly.io (Recommended)

1. **Cài đặt Fly CLI**
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **Login**
   ```bash
   fly auth login
   ```

3. **Tạo file Dockerfile**
   ```dockerfile
   # backend/Dockerfile
   FROM python:3.10-slim
   
   WORKDIR /app
   
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   
   COPY . .
   
   CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]
   ```

4. **Tạo fly.toml**
   ```bash
   cd backend
   fly launch --name your-calendar-api
   ```

5. **Set Environment Variables**
   ```bash
   fly secrets set GOOGLE_CLIENT_ID=your_id
   fly secrets set GOOGLE_CLIENT_SECRET=your_secret
   fly secrets set OAUTH_REDIRECT_URI=https://your-app.vercel.app/auth/callback
   fly secrets set FRONTEND_ORIGIN=https://your-app.vercel.app
   fly secrets set SESSION_SECRET=$(openssl rand -base64 32)
   ```

6. **Deploy**
   ```bash
   fly deploy
   ```
   
   URL: `https://your-calendar-api.fly.dev`

#### Option B: Render.com (Dễ hơn)

1. Vào: https://render.com
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Settings:
   - Name: `calendar-oauth-api`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
5. Environment Variables: (như Fly.io)
6. Deploy

---

## Option 2: Localhost với ngrok (Tạm thời)

Nếu chưa muốn deploy, dùng ngrok để expose localhost:

```bash
# Expose frontend
ngrok http 3000

# Terminal khác - Expose backend
ngrok http 8000
```

Lấy public URLs:
- Frontend: `https://abc123.ngrok.io`
- Backend: `https://def456.ngrok.io`

**Lưu ý**: ngrok URLs thay đổi mỗi lần restart (trừ khi có paid plan)

---

## Sau khi có Public URLs

### 1. Update Google Cloud Console

Vào: https://console.cloud.google.com/apis/credentials

**OAuth Client ID:**
- Authorized JavaScript origins:
  ```
  https://your-app.vercel.app
  ```
- Authorized redirect URIs:
  ```
  https://your-app.vercel.app/auth/callback
  ```

### 2. Update OAuth Consent Screen

Vào: https://console.cloud.google.com/apis/credentials/consent

**App Information:**
- App name: `Google Calendar OAuth App`
- User support email: your-email@gmail.com
- App logo: (optional - upload 120x120 PNG)

**App domain:**
- Application home page: `https://your-app.vercel.app`
- Application privacy policy: `https://your-app.vercel.app/privacy`
- Application terms of service: `https://your-app.vercel.app/terms`

**Authorized domains:**
- Add: `vercel.app`

**Developer contact information:**
- Email: your-email@gmail.com

**Scopes:**
- `.../auth/calendar.readonly`
- `openid`, `email`, `profile`

### 3. Publish App

- Scroll lên đầu trang OAuth Consent Screen
- Click **"PUBLISH APP"**
- Confirm

**Lưu ý**: Nếu dùng sensitive scopes (Calendar), Google sẽ review app (1-2 tuần).

---

## Verification cho Sensitive Scopes

### Google sẽ yêu cầu:

1. ✅ **Privacy Policy** - Done (có tại `/privacy`)
2. ✅ **Terms of Service** - Done (có tại `/terms`)
3. ✅ **Homepage** - Done (trang chủ với thông tin rõ ràng)
4. ✅ **YouTube video** (optional):
   - Screencast demo app (2-3 phút)
   - Giải thích cách app dùng Calendar data
   - Upload lên YouTube unlisted

5. ✅ **Justification**:
   - Giải thích tại sao cần Calendar scope
   - Use case: "Allow users to view their Google Calendar events"

### Submit for Verification:

Sau khi Publish, nếu dùng sensitive scope:
1. Google sẽ gửi email yêu cầu verification
2. Hoặc bạn thấy button "Submit for Verification"
3. Điền form, submit
4. Đợi 1-2 tuần

---

## URLs cần thiết (Summary)

Sau khi deploy, bạn sẽ có:

```
Homepage:         https://your-app.vercel.app
Privacy Policy:   https://your-app.vercel.app/privacy
Terms of Service: https://your-app.vercel.app/terms
About:            https://your-app.vercel.app/about
Backend API:      https://your-calendar-api.fly.dev
```

Đưa các URLs này vào Google Cloud Console OAuth Consent Screen!

---

## Production Checklist

- [ ] Frontend deployed lên Vercel
- [ ] Backend deployed lên Fly.io/Render
- [ ] Environment variables set đúng
- [ ] Database production-ready (PostgreSQL)
- [ ] CORS origins updated
- [ ] Cookie `Secure=True` (HTTPS)
- [ ] Google Cloud Console updated với production URLs
- [ ] OAuth Consent Screen filled với Privacy/Terms URLs
- [ ] App published to Production
- [ ] (Optional) Submit for verification nếu dùng sensitive scopes

---

## Troubleshooting

### redirect_uri_mismatch
→ Kiểm tra Authorized redirect URIs trong Google Console khớp với `OAUTH_REDIRECT_URI` trong backend .env

### CORS errors
→ Update `FRONTEND_ORIGIN` trong backend .env với production frontend URL

### Cookie not working in production
→ Đảm bảo set `Secure=True` cho cookies khi dùng HTTPS

---

Có thắc mắc? Liên hệ support@example.com

