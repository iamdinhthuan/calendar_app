export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none space-y-6">
          <p className="text-muted-foreground">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString('vi-VN')}
          </p>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Chấp nhận Điều khoản</h2>
            <p>
              Bằng cách truy cập và sử dụng Google Calendar OAuth App ("Dịch vụ"), bạn đồng ý tuân thủ 
              và bị ràng buộc bởi các Điều khoản dịch vụ này. Nếu bạn không đồng ý với bất kỳ phần nào 
              của các điều khoản này, vui lòng không sử dụng Dịch vụ.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Mô tả Dịch vụ</h2>
            <p>
              Google Calendar OAuth App là một ứng dụng web cho phép bạn:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Đăng nhập bằng tài khoản Google</li>
              <li>Xem các sự kiện từ Google Calendar của bạn</li>
              <li>Lọc sự kiện theo khoảng thời gian</li>
              <li>Quản lý lịch cá nhân</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Tài khoản người dùng</h2>
            <p>
              Để sử dụng Dịch vụ, bạn cần:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Có tài khoản Google hợp lệ</li>
              <li>Cấp quyền truy cập Google Calendar (read-only)</li>
              <li>Chịu trách nhiệm về mật khẩu và hoạt động tài khoản của bạn</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Quyền truy cập và Quyền riêng tư</h2>
            <p>
              Dịch vụ chỉ yêu cầu quyền <strong>đọc (read-only)</strong> Google Calendar của bạn. 
              Chúng tôi:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>KHÔNG chỉnh sửa hoặc xóa sự kiện của bạn</li>
              <li>KHÔNG chia sẻ dữ liệu của bạn với bên thứ ba</li>
              <li>CHỈ truy cập Calendar khi bạn yêu cầu</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Sử dụng được chấp nhận</h2>
            <p>Bạn đồng ý <strong>KHÔNG</strong>:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sử dụng Dịch vụ cho mục đích bất hợp pháp</li>
              <li>Cố gắng truy cập trái phép hệ thống</li>
              <li>Can thiệp vào hoạt động của Dịch vụ</li>
              <li>Sử dụng bot hoặc automation tool</li>
              <li>Vi phạm bất kỳ luật nào</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Quyền sở hữu trí tuệ</h2>
            <p>
              Dịch vụ và nội dung ban đầu của nó (trừ nội dung do người dùng cung cấp) là tài sản 
              của chúng tôi và được bảo vệ bởi bản quyền, nhãn hiệu và luật sở hữu trí tuệ khác.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Từ chối bảo đảm</h2>
            <p>
              Dịch vụ được cung cấp trên cơ sở "NGUYÊN TRẠNG" và "NHƯ CÓ SẴN". 
              Chúng tôi không đảm bảo rằng:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Dịch vụ sẽ không bị gián đoạn hoặc không có lỗi</li>
              <li>Dữ liệu sẽ chính xác hoặc đáng tin cậy</li>
              <li>Kết quả từ việc sử dụng Dịch vụ sẽ đáp ứng yêu cầu của bạn</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Giới hạn trách nhiệm</h2>
            <p>
              Trong mọi trường hợp, chúng tôi sẽ không chịu trách nhiệm về bất kỳ thiệt hại gián tiếp, 
              ngẫu nhiên, đặc biệt, hậu quả hoặc mang tính trừng phạt nào, bao gồm nhưng không giới hạn, 
              mất lợi nhuận, dữ liệu hoặc các tổn thất vô hình khác.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Thay đổi Điều khoản</h2>
            <p>
              Chúng tôi có quyền sửa đổi hoặc thay thế các Điều khoản này bất cứ lúc nào. 
              Nếu có thay đổi quan trọng, chúng tôi sẽ thông báo trước ít nhất 30 ngày.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Chấm dứt</h2>
            <p>
              Chúng tôi có thể chấm dứt hoặc tạm ngừng quyền truy cập của bạn ngay lập tức, 
              không cần thông báo trước, vì bất kỳ lý do gì, bao gồm nhưng không giới hạn 
              nếu bạn vi phạm Điều khoản dịch vụ.
            </p>
            <p className="mt-3">
              Bạn có thể chấm dứt sử dụng Dịch vụ bất cứ lúc nào bằng cách đăng xuất và 
              thu hồi quyền truy cập tại Google Account Settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Liên hệ</h2>
            <p>
              Nếu bạn có bất kỳ câu hỏi nào về Điều khoản dịch vụ này, vui lòng liên hệ:{' '}
              <a href="mailto:support@example.com" className="text-primary hover:underline">
                support@example.com
              </a>
            </p>
          </section>

          <section className="mt-12 p-6 bg-muted rounded-lg">
            <p className="text-sm">
              Bằng cách sử dụng Google Calendar OAuth App, bạn xác nhận rằng bạn đã đọc, 
              hiểu và đồng ý bị ràng buộc bởi các Điều khoản dịch vụ này.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

