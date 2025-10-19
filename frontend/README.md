# Frontend - Google Calendar OAuth App

Next.js 14 frontend với TypeScript, shadcn/ui, và Zustand state management.

## Yêu cầu

- Node.js 18+
- pnpm (hoặc npm/yarn)

## Cài đặt

### 1. Install pnpm (nếu chưa có)

```bash
npm install -g pnpm
```

### 2. Install Dependencies

```bash
cd frontend
pnpm install
```

### 3. Cấu hình Environment Variables

Copy file template và điền thông tin:

```bash
cp env.template .env.local
```

Chỉnh sửa `.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### 4. Cài đặt shadcn/ui Components

shadcn/ui components đã được tạo sẵn trong project. Nếu muốn thêm components khác:

```bash
# Initialize shadcn/ui (chỉ cần lần đầu)
npx shadcn-ui@latest init

# Add các components cần thiết
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add select
```

**Lưu ý:** Các UI components cơ bản (Button, Card, Alert, Skeleton) đã được tạo sẵn trong `components/ui/`.

## Chạy Development Server

```bash
pnpm dev
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

## Build Production

```bash
pnpm build
pnpm start
```

## Cấu trúc Project

```
frontend/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   ├── dashboard/
│   │   └── page.tsx         # Dashboard page
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── alert.tsx
│   │   └── skeleton.tsx
│   ├── LoginButton.tsx      # Google login button
│   ├── DateRangePicker.tsx  # Date range selector
│   ├── EventsList.tsx       # Calendar events list
│   └── HeaderBar.tsx        # Header with logout
├── lib/
│   ├── api.ts               # API client
│   ├── store.ts             # Zustand store
│   ├── time.ts              # Time utilities
│   └── utils.ts             # UI utilities
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Features

### Pages

- **Landing Page (`/`)**: Hero section với "Sign in with Google" button
- **Dashboard (`/dashboard`)**: Hiển thị calendar events với date range picker

### Components

- **LoginButton**: Khởi tạo OAuth flow
- **DateRangePicker**: Chọn khoảng thời gian (This Week, This Month, Next Week)
- **EventsList**: Render danh sách events với loading/error/empty states
- **HeaderBar**: Navigation bar với logout button

### State Management

Sử dụng Zustand để quản lý:
- Date range selection
- Events data
- Loading/error states

### API Integration

Tất cả requests đến backend đều dùng `credentials: "include"` để gửi session cookie.

Endpoints:
- `GET /auth/login` - Lấy OAuth URL
- `POST /auth/logout` - Logout
- `GET /api/events` - Fetch calendar events

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Re-usable components built with Radix UI
- **CSS Variables**: Theme customization qua CSS variables

## Timezone

Mặc định sử dụng timezone **Asia/Bangkok**. Có thể thay đổi trong `lib/time.ts`.

## Nâng cấp UI

### Thêm Calendar Popover cho Date Picker

Để có UI chọn ngày đẹp hơn:

```bash
npx shadcn-ui@latest add calendar popover
```

Sau đó update `DateRangePicker.tsx` để sử dụng Calendar component.

### Thêm Dark Mode

1. Install next-themes:
```bash
pnpm add next-themes
```

2. Wrap app với ThemeProvider trong `layout.tsx`
3. Add theme toggle button

## Troubleshooting

### CORS Error

→ Kiểm tra backend đang chạy và `NEXT_PUBLIC_BACKEND_URL` đúng.

### Cookie not sent

→ Đảm bảo `credentials: "include"` trong fetch requests và backend CORS cho phép credentials.

### Build errors

→ Chạy `pnpm install` lại và xóa `.next` folder:
```bash
rm -rf .next
pnpm install
pnpm dev
```

