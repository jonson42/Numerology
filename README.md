# CỔNG TRA CỨU ĐA DỊCH VỤ: THẦN SỐ HỌC, DISC, MBTI & TỬ VI
> Lấy cảm hứng từ hệ sinh thái [tracuuthansohoc.com](https://tracuuthansohoc.com)  
> Kiến trúc: **.NET 8 Clean Architecture** (Backend) + **React 18, Vite & TailwindCSS** (Frontend)  
> Thanh toán tự động: **VietQR** (Sinh mã QR động) + **SePay Webhook** (Tự động kích hoạt VIP)  
> Ngôn ngữ: **Tiếng Việt 100%**

---

## 🌟 CÁC PHÂN HỆ CHÍNH

1. **Thần Số Học Pythagoras (Standard & Kids)**
   - Chuẩn hóa tiếng Việt, tách nguyên âm & phụ âm theo quy tắc chữ Y trong tiếng Việt (MY, LY, VY, YEN...).
   - Tính toán đầy đủ **26+ chỉ số**: Số Chủ Đạo, Sứ Mệnh, Linh Hồn, Nhân Cách, Ngày Sinh, Thái Độ, Trưởng Thành, Cân Bằng, Tư Duy Lý Trí, Nợ Nghiệp (13/4, 14/5, 16/7, 19/1), Năm Cá Nhân, Tháng Cá Nhân...
   - **3 Biểu đồ SVG chuyên dụng**:
     - **Lưới 3x3** (Hàng 1: 3-6-9, Hàng 2: 2-5-8, Hàng 3: 1-4-7) với đường kẻ mũi tên cá tính và chỉ số cô lập.
     - **Kim tự tháp 4 đỉnh cao & 4 thử thách** với các mốc tuổi và năm đại vận.
     - **Đồ thị chu kỳ 9 năm hình sin** tương tác bấm vào từng năm để xem dự báo.
   - **Audio Thuyết Minh AI**: Giọng đọc diễn cảm phân tích con số chủ đạo.
   - **Xuất PDF báo cáo**: Sử dụng thư viện **QuestPDF** tạo file PDF bản in chuyên nghiệp.

2. **Trắc Nghiệm Tính Cách DISC**
   - 8 kịch bản tình huống thực tế, đo lường 4 nhóm: **D** (Thống trị), **I** (Ảnh hưởng), **S** (Kiên định), **C** (Tuân thủ).
   - Biểu đồ tỷ lệ %, phân tích điểm mạnh, điểm yếu, môi trường làm việc và nghề nghiệp phù hợp.

3. **Trắc Nghiệm Tính Cách MBTI (16 Nhóm)**
   - 12 câu hỏi tình huống chuẩn quốc tế phân định 4 cặp lưỡng phân: **E / I**, **S / N**, **T / F**, **J / P**.
   - Bảng phân tích chi tiết cho cả 16 nhóm (INTJ, ENFP, INFJ, ISTJ...), tỷ lệ % và gợi ý cặp đôi hòa hợp.

4. **Tử Vi & Chiêm Tinh Bản Đồ Sao**
   - Tự động nhận diện cung hoàng đạo từ ngày sinh, phân tích nguyên tố (Lửa, Đất, Khí, Nước), hành tinh chủ quản, cung hợp tình duyên và dự báo vận trình 2026.

5. **Cơ Chế Freemium & Bảo Mật Paywall Server-Side**
   - Người dùng miễn phí: Xem trọn vẹn các chỉ số cốt lõi (Số Chủ Đạo, Sứ Mệnh, Linh Hồn, Nhân Cách, Thái Độ, Ngày Sinh).
   - Các chỉ số chuyên sâu VIP (Trưởng Thành, Nợ Nghiệp, Dự Báo Vận Hạn, Kim Tự Tháp Chi Tiết) được bảo vệ bằng lớp mờ (Blur) và nút Mở Khóa VIP.
   - **Bảo mật tuyệt đối**: Nội dung VIP không trả về client ở trạng thái chưa mở khóa (được mã hóa/rút gọn từ Server-side).

6. **Phân Hệ Thanh Toán VietQR & SePay Webhook**
   - Chọn gói VIP: Gói 1 Năm (199.000đ) hoặc Gói Trọn Đời (399.000đ).
   - Nhập số điện thoại -> Hệ thống sinh mã đơn hàng độc nhất (`VIPxxxxxx`).
   - Tự động hiển thị mã **VietQR** chuyển khoản với thông tin ngân hàng thụ hưởng và đúng nội dung chuyển khoản yêu cầu.
   - Frontend tự động Polling lắng nghe webhook từ **SePay** và tự động nâng cấp VIP sau 3 giây.
   - Tích hợp nút **"⚡ Thử nghiệm ngay: Mô phỏng SePay đã nhận tiền"** để test trực tiếp trong môi trường phát triển.

7. **Trang Quản Trị Hệ Thống (Admin Panel)**
   - Dashboard thống kê tổng: Người dùng, Thành viên VIP, Doanh thu VietQR, Đơn hàng và Báo cáo đã tạo.
   - Quản lý kho nội dung luận giải: Tìm kiếm, lọc theo phân hệ, chỉnh sửa Tiêu đề, Tóm tắt, Nội dung HTML và cờ Khóa VIP.
   - Quản lý đơn hàng mua VIP và kích hoạt VIP thủ công cho người dùng.

---

## 🏗️ CẤU TRÚC THƯ MỤC DỰ ÁN

```plaintext
d:\Peronal\Source\Numerology/
├── NumerologyPortal.Backend/                    # .NET 8 Clean Architecture
│   ├── NumerologyPortal.sln
│   └── src/
│       ├── Numerology.Domain/                   # Entities, Value Objects, Enums
│       │   ├── Entities/                        # UserAccount, LookupReport, InterpretationMaster, TransactionOrder, SystemSetting
│       │   ├── ValueObjects/                    # NumerologyMetrics, BirthChartGridData, PyramidPeakData
│       │   └── Enums/                           # ServiceTypeEnum, OrderStatusEnum
│       ├── Numerology.Application/              # Application Logic & Engine
│       │   ├── Common/Interfaces & Models/      # IJwtTokenGenerator, IVietQrService, ISePayService, IPdfReportService
│       │   ├── Services/NumerologyEngine/       # VietnameseNameNormalizer, PythagorasCalculator, BirthGridCalculator, PyramidPeakCalculator, LifeCycleWaveCalculator
│       │   ├── Services/DiscMbtiEngine/         # DiscEngine, MbtiEngine
│       │   ├── Services/ReportAssemblerService  # Lắp ráp báo cáo & Paywall Server-side
│       │   └── Features/Dtos/                   # Auth, Reports, Payments, Admin DTOs
│       ├── Numerology.Infrastructure/           # EF Core SQLite, Seeding, External Services
│       │   ├── Persistence/                     # NumerologyDbContext
│       │   ├── Seeders/                         # DatabaseSeeder (Tự động seed dữ liệu)
│       │   └── Services/                        # VietQrService, SePayService, QuestPdfGenerator, JwtTokenGenerator
│       └── Numerology.Api/                      # ASP.NET Core Web API Controllers
│           ├── Controllers/                     # AuthController, ReportsController, QuizzesController, PaymentsController, AdminController
│           ├── appsettings.json
│           └── Program.cs
│
└── numerology-portal-frontend/                  # React 18 + Vite + TailwindCSS
    ├── index.html
    ├── src/
    │   ├── api/                                 # Axios Client, reportApi, authApi, paymentApi, quizApi, adminApi
    │   ├── types/                               # TypeScript interfaces khớp 100% với BE DTOs
    │   ├── components/
    │   │   ├── layout/                          # CosmicBackground, TopNavbar, Footer
    │   │   ├── charts/                          # BirthAndNameGrid3x3, NumerologyPyramidSvg, LifeCycleWaveChart
    │   │   ├── paywall/                         # VipLockedOverlay, VipUpgradeModal (VietQR & SePay Polling)
    │   │   ├── auth/                            # LoginModal (Phone OTP)
    │   │   └── common/                          # AudioPlayerCard (Thuyết minh AI)
    │   ├── modules/
    │   │   ├── numerology/                      # NumerologyForm (Chuẩn & Trẻ em)
    │   │   ├── disc-mbti/                       # DiscQuizModule, MbtiQuizModule
    │   │   ├── astrology/                       # AstrologyModule (12 Cung hoàng đạo)
    │   │   └── admin/                           # AdminDashboard (Doanh thu, Luận giải, Đơn hàng, VIP)
    │   ├── pages/                               # ReportViewPage (?view=token)
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css                            # Glassmorphism, Cosmic dark theme
```

---

## 🚀 HƯỚNG DẪN KHỞI CHẠY HỆ THỐNG

### 1. Khởi chạy Backend (.NET 8 Web API)
```bash
cd NumerologyPortal.Backend
dotnet run --project src/Numerology.Api/Numerology.Api.csproj --urls "http://localhost:5000"
```
- API chạy tại: **http://localhost:5000**
- Swagger UI tài liệu API: **http://localhost:5000/swagger**
- Cơ sở dữ liệu SQLite (`numerology.db`) tự động khởi tạo và seed sẵn:
  - Tài khoản Admin: `0988888888` (Mã OTP: `123456`)
  - Tài khoản User mẫu: `0912345678` (Mã OTP: `123456`)
  - Kho luận giải mặc định cho 26+ chỉ số thần số học, DISC, MBTI và cấu hình VietQR.

### 2. Khởi chạy Frontend (React + Vite + TailwindCSS)
```bash
cd numerology-portal-frontend
npm run dev
```
- Frontend chạy tại: **http://localhost:5173**

---

## 💳 QUY TRÌNH THANH TOÁN VIETQR & SEPAY WEBHOOK

1. Người dùng bấm **"Nâng Cấp VIP"** hoặc click vào phần luận giải bị khóa mờ trên báo cáo.
2. Chọn gói (1 Năm: 199.000đ hoặc Trọn Đời: 399.000đ), nhập số điện thoại.
3. API `/api/payments/create-order` sinh mã đơn hàng độc nhất dạng `VIPxxxxxx` và trả về URL ảnh **VietQR QuickLink**.
4. Khách hàng quét mã trên app ngân hàng và chuyển khoản với cú pháp `VIP xxxxxx`.
5. Hệ thống **SePay** gửi thông báo về webhook `POST /api/payments/sepay-webhook`:
   - Backend phân tích nội dung chuyển khoản, so khớp `orderCode`.
   - Chuyển trạng thái đơn hàng sang `Success`.
   - Tự động nâng cấp `IsVip = true` cho tài khoản và gia hạn ngày hết hạn.
6. Frontend tự động Polling `/api/payments/check-order/{orderCode}`, hiển thị pháo hoa chúc mừng (Confetti) và lập tức mở khóa toàn bộ báo cáo!
