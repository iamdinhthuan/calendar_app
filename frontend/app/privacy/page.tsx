export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <p className="text-muted-foreground">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('vi-VN')}
          </p>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Thông tin chúng tôi thu thập</h2>
            <p>
              Khi bạn sử dụng Google Calendar OAuth App, chúng tôi thu thập các thông tin sau từ tài khoản Google của bạn:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Địa chỉ email</li>
              <li>Thông tin hồ sơ cơ bản (tên, ảnh đại diện)</li>
              <li>Dữ liệu Google Calendar (chỉ đọc - read-only)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Cách chúng tôi sử dụng thông tin</h2>
            <p>Chúng tôi sử dụng thông tin của bạn để:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Xác thực và duy trì phiên đăng nhập của bạn</li>
              <li>Hiển thị các sự kiện từ Google Calendar của bạn</li>
              <li>Cung cấp dịch vụ quản lý lịch</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Lưu trữ dữ liệu</h2>
            <p>
              Chúng tôi lưu trữ refresh token của Google để duy trì quyền truy cập vào Calendar của bạn. 
              Token này được bảo mật và chỉ được sử dụng để truy xuất dữ liệu Calendar theo yêu cầu của bạn.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Chia sẻ dữ liệu</h2>
            <p>
              Chúng tôi <strong>KHÔNG</strong> chia sẻ, bán hoặc cho thuê thông tin cá nhân của bạn cho bên thứ ba.
              Dữ liệu của bạn chỉ được sử dụng trong phạm vi ứng dụng này.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Bảo mật</h2>
            <p>
              Chúng tôi sử dụng các biện pháp bảo mật tiêu chuẩn ngành để bảo vệ thông tin của bạn:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>HTTPS encryption</li>
              <li>HttpOnly cookies</li>
              <li>Secure token storage</li>
              <li>OAuth 2.0 authentication</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Quyền của bạn</h2>
            <p>Bạn có quyền:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Truy cập dữ liệu cá nhân của bạn</li>
              <li>Yêu cầu xóa dữ liệu</li>
              <li>Thu hồi quyền truy cập bất cứ lúc nào</li>
              <li>Đăng xuất và xóa session</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Thu hồi quyền truy cập</h2>
            <p>
              Bạn có thể thu hồi quyền truy cập của app vào Google Calendar bất cứ lúc nào tại:{' '}
              <a 
                href="https://myaccount.google.com/permissions" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Account Permissions
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Thay đổi chính sách</h2>
            <p>
              Chúng tôi có thể cập nhật Chính sách bảo mật này theo thời gian. 
              Mọi thay đổi sẽ được cập nhật trên trang này với ngày "Last Updated" mới.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Liên hệ</h2>
            <p>
              Nếu bạn có bất kỳ câu hỏi nào về Chính sách bảo mật này, vui lòng liên hệ:{' '}
              <a href="mailto:support@example.com" className="text-primary hover:underline">
                support@example.com
              </a>
            </p>
          </section>

          <section className="mt-12 p-6 bg-muted rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Google API Services User Data Policy</h3>
            <p className="text-sm">
              Google Calendar OAuth App tuân thủ{' '}
              <a 
                href="https://developers.google.com/terms/api-services-user-data-policy" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google API Services User Data Policy
              </a>
              , bao gồm các yêu cầu về Limited Use.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

