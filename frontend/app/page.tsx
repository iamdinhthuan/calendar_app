import LoginButton from "@/components/LoginButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Lock, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex justify-center mb-6">
            <Calendar className="h-16 w-16 text-primary" />
          </div>
          
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Google Calendar OAuth
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Truy cập Google Calendar của bạn một cách an toàn với OAuth 2.0
          </p>
          
          <div className="mb-8">
            <LoginButton />
          </div>
          
          <p className="text-sm text-muted-foreground">
            Đăng nhập để xem và quản lý sự kiện Calendar của bạn
          </p>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Lock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Bảo mật</CardTitle>
              <CardDescription>
                OAuth 2.0 với session-based authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Token được lưu an toàn ở server, không bao giờ expose ra client
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Calendar Access</CardTitle>
              <CardDescription>
                Xem tất cả sự kiện từ Google Calendar
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Lọc theo date range, timezone Asia/Bangkok, hiển thị attendees
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Modern Stack</CardTitle>
              <CardDescription>
                Next.js 14 + FastAPI + shadcn/ui
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              TypeScript, Zustand state management, Tailwind CSS
            </CardContent>
          </Card>
        </div>

        {/* Tech Stack */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Next.js 14",
              "FastAPI",
              "Python",
              "TypeScript",
              "shadcn/ui",
              "Zustand",
              "Google OAuth 2.0",
              "SQLite",
              "Tailwind CSS",
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="max-w-4xl mx-auto mt-24 pt-8 border-t text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-4">
            <a href="/about" className="hover:text-primary transition-colors">
              About
            </a>
            <a href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="mailto:support@example.com" className="hover:text-primary transition-colors">
              Contact
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Google Calendar OAuth App. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}

