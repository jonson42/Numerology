import React, { useState, useEffect } from 'react';
import { CosmicBackground } from './components/layout/CosmicBackground';
import { TopNavbar } from './components/layout/TopNavbar';
import { Footer } from './components/layout/Footer';
import { NumerologyForm } from './modules/numerology/NumerologyForm';
import { ReportViewPage } from './pages/ReportViewPage';
import { DiscQuizModule } from './modules/disc-mbti/DiscQuizModule';
import { MbtiQuizModule } from './modules/disc-mbti/MbtiQuizModule';
import { AstrologyModule } from './modules/astrology/AstrologyModule';
import { AdminDashboard } from './modules/admin/AdminDashboard';
import { LoginModal } from './components/auth/LoginModal';
import { VipUpgradeModal } from './components/paywall/VipUpgradeModal';
import { authApi } from './api/authApi';
import { reportApi } from './api/reportApi';
import type { UserAccountDto } from './types/user.types';
import type { LookupReportDto } from './types/report.types';
import { Sparkles, Shield, Award, Users, ArrowRight, Star, Heart, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('numerology');
  const [currentUser, setCurrentUser] = useState<UserAccountDto | null>(null);
  const [currentReport, setCurrentReport] = useState<LookupReportDto | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Khởi tạo: kiểm tra token đăng nhập và query param ?view=token
  useEffect(() => {
    checkSavedUser();
    checkUrlShareToken();
  }, []);

  const checkSavedUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await authApi.getCurrentUser();
        if (res.success && res.data) {
          setCurrentUser(res.data);
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  };

  const checkUrlShareToken = async () => {
    const params = new URLSearchParams(window.location.search);
    const viewToken = params.get('view');
    if (viewToken) {
      setLoadingReport(true);
      try {
        const res = await reportApi.getReportByToken(viewToken);
        if (res.success && res.data) {
          setCurrentReport(res.data);
          setActiveTab('report');
        }
      } catch (err) {
        console.error('Không tải được báo cáo từ share token:', err);
      } finally {
        setLoadingReport(false);
      }
    }
  };

  const handleReportGenerated = (report: LookupReportDto) => {
    setCurrentReport(report);
    // Cập nhật URL với query param ?view=token mà không reload trang
    const newUrl = `${window.location.pathname}?view=${report.shareToken}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    setActiveTab('report');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const handleLoginSuccess = (user: UserAccountDto) => {
    setCurrentUser(user);
    // Nếu đang xem báo cáo, tự động reload lại báo cáo với quyền VIP nếu có
    if (currentReport) {
      reportApi.getReportByToken(currentReport.shareToken).then(res => {
        if (res.success) setCurrentReport(res.data);
      });
    }
  };

  const handleVipSuccess = () => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, isVip: true });
    }
    if (currentReport) {
      // Reload báo cáo để mở khóa toàn bộ nội dung VIP
      reportApi.getReportByToken(currentReport.shareToken).then(res => {
        if (res.success) setCurrentReport(res.data);
      });
    }
  };

  return (
    <CosmicBackground>
      {/* Thanh điều hướng Top Navbar */}
      <TopNavbar
        activeTab={activeTab === 'report' ? 'numerology' : activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'report') {
            // Xóa query param ?view khi chuyển tab
            window.history.pushState({}, '', window.location.pathname);
          }
        }}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenUpgradeVip={() => setIsUpgradeModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Nội dung chính theo từng phân hệ */}
      <main className="flex-1 py-6 sm:py-10">
        {loadingReport ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
            <p className="text-sm text-purple-300 font-medium">Đang tải và giải mã dữ liệu bản mệnh...</p>
          </div>
        ) : activeTab === 'report' && currentReport ? (
          <ReportViewPage
            report={currentReport}
            onOpenUpgradeVip={() => setIsUpgradeModalOpen(true)}
            onBackToLookup={() => {
              setActiveTab('numerology');
              setCurrentReport(null);
              window.history.pushState({}, '', window.location.pathname);
            }}
          />
        ) : activeTab === 'numerology' ? (
          <div className="space-y-16">
            <NumerologyForm onReportGenerated={handleReportGenerated} isKidMode={false} />

            {/* Các điểm nổi bật của hệ thống */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-2 mb-10">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Hệ Sinh Thái Toàn Diện
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-white">
                  Vì Sao Hơn 500.000+ Người Tin Tưởng Tra Cứu?
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card rounded-2xl p-6 border border-purple-500/20 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Thuật Toán Pythagoras Chuẩn</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Xử lý chính xác toàn bộ chữ cái tiếng Việt (quy tắc nguyên âm chữ Y), bảo lưu các con số Master 11, 22, 33 và chỉ ra 4 nợ nghiệp 13, 14, 16, 19.
                  </p>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-amber-500/20 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">3 Biểu Đồ Trực Quan Sinh Động</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Lưới 3x3 tự động kẻ mũi tên cá tính, Kim tự tháp 4 đỉnh cao kèm 4 thử thách và đồ thị chu kỳ 9 năm hình sin tương tác mượt mà.
                  </p>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-emerald-500/20 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Kích Hoạt VietQR Tự Động</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Tích hợp chuẩn VietQR và SePay webhook tự động nhận diện giao dịch chuyển khoản, mở khóa báo cáo VIP tức thì sau 3 giây.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'numerology-kid' ? (
          <NumerologyForm onReportGenerated={handleReportGenerated} isKidMode={true} />
        ) : activeTab === 'disc' ? (
          <DiscQuizModule />
        ) : activeTab === 'mbti' ? (
          <MbtiQuizModule />
        ) : activeTab === 'astrology' ? (
          <AstrologyModule />
        ) : activeTab === 'admin' ? (
          <AdminDashboard />
        ) : null}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modal Đăng Nhập OTP */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Modal Nâng Cấp VIP VietQR & SePay */}
      <VipUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onSuccess={handleVipSuccess}
        initialPhone={currentUser?.phoneNumber || ''}
      />
    </CosmicBackground>
  );
};

export default App;
