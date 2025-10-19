import { Calendar, Shield, Zap, Users, Lock, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex justify-center mb-6">
            <Calendar className="h-20 w-20 text-primary" />
          </div>
          
          <h1 className="text-5xl font-bold mb-4">
            Google Calendar OAuth App
          </h1>
          
          <p className="text-xl text-muted-foreground mb-6">
            Ứng dụng quản lý Google Calendar an toàn, đơn giản và hiện đại
          </p>
          
          <div className="flex gap-4 justify-center">
            <a href="/" className="text-primary hover:underline">
              Trang chủ
            </a>
            <span className="text-muted-foreground">•</span>
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
            <span className="text-muted-foreground">•</span>
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Tính năng nổi bật</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Bảo mật cao</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sử dụng OAuth 2.0, session-based authentication với httpOnly cookies. 
                  Token Google được lưu an toàn ở server-side.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Lock className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Quyền Read-Only</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  App chỉ yêu cầu quyền đọc Calendar. Không thể chỉnh sửa, tạo mới 
                  hoặc xóa sự kiện của bạn.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Multi-User</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Hỗ trợ nhiều người dùng cùng lúc. Mỗi user có dữ liệu và session riêng biệt, 
                  hoàn toàn độc lập.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Lọc theo thời gian</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Xem sự kiện theo tuần, tháng hoặc khoảng thời gian tùy chỉnh. 
                  Hỗ trợ timezone Asia/Bangkok.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Hiện đại & Nhanh</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Xây dựng với Next.js 14, FastAPI, TypeScript. 
                  UI đẹp với shadcn/ui và Tailwind CSS.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <RefreshCw className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Tự động Refresh Token</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Backend tự động làm mới access token khi hết hạn. 
                  Bạn không cần login lại thường xuyên.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Tech Stack</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Backend</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✓ FastAPI (Python)</li>
                  <li>✓ SQLModel + SQLite</li>
                  <li>✓ google-auth & google-api-python-client</li>
                  <li>✓ python-jose (JWT)</li>
                  <li>✓ OAuth 2.0 authentication</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frontend</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✓ Next.js 14 (App Router)</li>
                  <li>✓ TypeScript</li>
                  <li>✓ shadcn/ui components</li>
                  <li>✓ Zustand (state management)</li>
                  <li>✓ Tailwind CSS</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How it works */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Cách hoạt động</h2>
          
          <Card>
            <CardContent className="pt-6">
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    1
                  </span>
                  <div>
                    <strong>Đăng nhập</strong>
                    <p className="text-muted-foreground">
                      Click "Sign in with Google" → redirect đến Google OAuth consent screen
                    </p>
                  </div>
                </li>
                
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    2
                  </span>
                  <div>
                    <strong>Cấp quyền</strong>
                    <p className="text-muted-foreground">
                      Cho phép app đọc Google Calendar (read-only scope)
                    </p>
                  </div>
                </li>
                
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    3
                  </span>
                  <div>
                    <strong>Lưu token</strong>
                    <p className="text-muted-foreground">
                      Backend lưu refresh token an toàn, tạo session cookie cho frontend
                    </p>
                  </div>
                </li>
                
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    4
                  </span>
                  <div>
                    <strong>Xem Calendar</strong>
                    <p className="text-muted-foreground">
                      Chọn khoảng thời gian, fetch events từ Google Calendar API
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Security & Privacy */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Cam kết Bảo mật & Quyền riêng tư
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>✓ Tuân thủ Google API Services User Data Policy</p>
              <p>✓ KHÔNG chia sẻ, bán hoặc cho thuê dữ liệu của bạn</p>
              <p>✓ Token Google chỉ được lưu server-side, mã hóa an toàn</p>
              <p>✓ HTTPS encryption cho mọi request</p>
              <p>✓ Bạn có thể thu hồi quyền truy cập bất cứ lúc nào</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact */}
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Liên hệ & Hỗ trợ</h2>
          <p className="text-muted-foreground mb-6">
            Nếu bạn có câu hỏi, góp ý hoặc cần hỗ trợ, vui lòng liên hệ:
          </p>
          <a 
            href="mailto:support@example.com"
            className="text-primary text-lg hover:underline"
          >
            support@example.com
          </a>
        </div>
      </div>
    </main>
  );
}

