import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, User, ArrowRight, Loader2, Award, Zap } from 'lucide-react';
import { reportApi } from '../../api/reportApi';
import type { LookupReportDto } from '../../types/report.types';

interface Props {
  onReportGenerated: (report: LookupReportDto) => void;
  isKidMode?: boolean;
}

export const NumerologyForm: React.FC<Props> = ({ onReportGenerated, isKidMode = false }) => {
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('1998-08-18');
  const [birthTime, setBirthTime] = useState('');
  const [gender, setGender] = useState('Nam');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !birthDate) return;

    setLoading(true);
    try {
      const res = await reportApi.createReport({
        fullName: fullName.trim(),
        birthDate: `${birthDate}T00:00:00`,
        birthTime: birthTime || undefined,
        gender,
        serviceType: isKidMode ? 2 : 1
      });

      if (res.success && res.data) {
        onReportGenerated(res.data);
      }
    } catch (err: any) {
      const msg = err?.message || (typeof err === 'string' ? err : 'Có lỗi xảy ra khi tạo báo cáo tra cứu.');
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    if (isKidMode) {
      setFullName('Nguyễn Minh Khang');
      setNickname('Bé Bon');
      setBirthDate('2018-06-12');
      setGender('Nam');
    } else {
      setFullName('Nguyễn Văn An');
      setBirthDate('1995-10-15');
      setGender('Nam');
    }
  };

  return (
    <div className="max-w-2xl mx-auto glass-card rounded-3xl p-6 sm:p-10 border border-purple-500/30 relative">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/50 border border-purple-500/40 text-amber-300 text-xs font-semibold mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          {isKidMode ? 'Bản Đồ Định Hướng Cho Con Chuẩn Pythagoras' : 'Tra Cứu Bản Đồ Vận Mệnh Pythagoras 2026'}
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-purple-100 via-white to-amber-200 tracking-normal leading-snug">
          {isKidMode ? 'Thần Số Học Trẻ Em & Nuôi Dạy Con' : 'Khám Phá Bản Thiết Kế Linh Hồn'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          {isKidMode
            ? 'Giải mã năng khiếu thiên bẩm, điểm yếu tính cách và phương pháp kích hoạt tư duy tối ưu cho con ngay từ nhỏ.'
            : 'Nhập họ tên khai sinh và ngày sinh dương lịch để tính toán chính xác 26+ chỉ số định mệnh và vận trình tương lai.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Họ và tên */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>{isKidMode ? 'Họ và tên của con (Khai sinh):' : 'Họ và tên đầy đủ (Trên CMND/CCCD):'}</span>
            <span className="text-[11px] text-purple-400 font-normal lowercase">Gõ tiếng Việt có dấu</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="text"
              required
              placeholder={isKidMode ? "Ví dụ: Nguyễn Minh Khang" : "Ví dụ: Nguyễn Văn An"}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm font-medium transition"
            />
          </div>
        </div>

        {isKidMode && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Tên gọi ở nhà của bé (Nếu có):
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Bé Bon, Sushi, Bắp..."
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm font-medium transition"
            />
          </div>
        )}

        {/* Ngày sinh */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Ngày sinh dương lịch:
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-sm font-mono transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Giờ sinh (Không bắt buộc):
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-sm font-mono transition"
              />
            </div>
          </div>
        </div>

        {/* Giới tính */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Giới tính:
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['Nam', 'Nữ', 'Khác'].map(g => (
              <button
                type="button"
                key={g}
                onClick={() => setGender(g)}
                className={`py-2.5 rounded-xl text-xs font-semibold border transition ${
                  gender === g
                    ? 'bg-purple-900/60 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Nút hành động */}
        <div className="pt-2 space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white font-bold text-base hover:brightness-110 shadow-[0_0_25px_rgba(147,51,234,0.4)] transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Xem Kết Quả Báo Cáo Ngay</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2 rounded-xl text-xs text-purple-300 hover:text-white bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 transition flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Điền dữ liệu mẫu kiểm tra nhanh
          </button>
        </div>
      </form>
    </div>
  );
};
