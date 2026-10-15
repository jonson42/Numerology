import React from 'react';
import { Lock, Crown, Sparkles } from 'lucide-react';

interface Props {
  title?: string;
  onUnlockClick: () => void;
}

export const VipLockedOverlay: React.FC<Props> = ({
  title = "Nội dung luận giải chuyên sâu VIP",
  onUnlockClick,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-slate-950/80 p-6 sm:p-8 text-center my-4">
      {/* Nền mờ giả lập văn bản chuyên sâu */}
      <div className="blur-sm opacity-20 pointer-events-none select-none text-left space-y-2 text-xs sm:text-sm">
        <p>
          Vận trình sự nghiệp của bạn trong giai đoạn này chịu sự tác động cực đại của trường năng lượng chuyển dịch. Các cơ hội tài chính lớn sẽ xuất hiện vào quý 3 và quý 4. Cần đặc biệt chú ý đối tác làm ăn có cung mệnh tương hợp để tránh tổn thất...
        </p>
        <p>
          Bản đồ phong thủy số học chỉ ra rằng con số tương sinh mang lại may mắn tột đỉnh cho bạn trong công danh là những con số thuộc trục tâm thức...
        </p>
        <p>
          Phương pháp giải trừ hạn vận và chuyển hóa phúc đức tiền kiếp thông qua các hành động thiết thực hằng ngày...
        </p>
      </div>

      {/* Hộp thoại khóa VIP nổi ở giữa */}
      <div className="relative z-10 flex flex-col items-center max-w-md mx-auto -mt-24 sm:-mt-20">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.5)] animate-bounce mb-3">
          <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
            <Lock className="w-7 h-7 text-amber-400" />
          </div>
        </div>

        <h4 className="text-lg sm:text-xl font-bold font-cinzel text-amber-300 flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-400" />
          {title}
        </h4>

        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
          Mở khóa toàn bộ luận giải 26+ chỉ số, 4 đỉnh cao Kim tự tháp, dự báo tài lộc & tình duyên trọn đời với VietQR tự động.
        </p>

        <button
          onClick={onUnlockClick}
          className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-bold text-sm sm:text-base hover:brightness-110 shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all flex items-center gap-2 group cursor-pointer"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Mở Khóa Báo Cáo VIP Ngay (Chỉ từ 199k)
        </button>

        <p className="text-[11px] text-slate-400 mt-2">
          ⚡ Quét mã VietQR chuyển khoản ngân hàng • Kích hoạt tự động sau 3 giây
        </p>
      </div>
    </div>
  );
};
