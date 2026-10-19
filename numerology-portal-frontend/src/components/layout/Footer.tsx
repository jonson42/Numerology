import React from 'react';
import { Sparkles, Heart, Shield, Award, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-purple-500/15 bg-[#05030f]/90 text-slate-400 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Cột 1: Giới thiệu */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-amber-500 p-0.5">
                <div className="w-full h-full bg-[#0a0720] rounded-lg flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>
              </div>
              <span className="font-cinzel text-base font-bold text-white tracking-wider">
                THẦN SỐ HỌC
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cổng thông tin tra cứu thần số học Pythagoras, trắc nghiệm tâm lý DISC, MBTI và chiêm tinh học toàn diện hàng đầu.
            </p>
            <p className="text-xs text-purple-200/85 italic font-serif leading-relaxed tracking-wide">
              &ldquo;Con số cai trị cả vũ trụ và tiết lộ bản thiết kế của linh hồn.&rdquo; — Pythagoras
            </p>
          </div>

          {/* Cột 2: Dịch vụ */}
          <div className="space-y-2 text-xs">
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Dịch Vụ Tra Cứu
            </h4>
            <ul className="space-y-2">
              <li><span className="hover:text-purple-300 transition cursor-pointer">Thần Số Học Pythagoras</span></li>
              <li><span className="hover:text-purple-300 transition cursor-pointer">Thần Số Học Cho Trẻ Em</span></li>
              <li><span className="hover:text-purple-300 transition cursor-pointer">Trắc Nghiệm Tính Cách DISC</span></li>
              <li><span className="hover:text-purple-300 transition cursor-pointer">Trắc Nghiệm Tính Cách MBTI</span></li>
              <li><span className="hover:text-purple-300 transition cursor-pointer">Tử Vi & Bản Đồ Sao Cá Nhân</span></li>
            </ul>
          </div>

          {/* Cột 3: Tiêu chuẩn kỹ thuật */}
          <div className="space-y-2 text-xs">
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Bảo Mật & Thanh Toán
            </h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-center gap-2 text-emerald-400">
                <Shield className="w-4 h-4 shrink-0" />
                <span>Bảo mật Paywall Server-side 100%</span>
              </div>
              <div className="flex items-center gap-2 text-amber-400">
                <Award className="w-4 h-4 shrink-0" />
                <span>Thanh toán VietQR & SePay Webhook tức thì</span>
              </div>
              <div className="flex items-center gap-2 text-purple-400">
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>Xuất PDF báo cáo bản in chất lượng cao</span>
              </div>
            </div>
          </div>

          {/* Cột 4: Hỗ trợ khách hàng */}
          <div className="space-y-2 text-xs">
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Hỗ Trợ Khách Hàng
            </h4>
            <p className="text-slate-400">Hotline / Zalo: 0901.234.567</p>
            <p className="text-slate-400">Email: support@thansohoc.portal</p>
            <p className="text-slate-400">Thời gian làm việc: 8:00 - 22:00 hằng ngày</p>
            <div className="pt-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ● Hệ thống hoạt động 24/7
              </span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Cổng Thông Tin Tra Cứu Thần Số Học & Trắc Nghiệm Tâm Lý. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-slate-400">
            Được xây dựng bởi Master <span className="font-semibold text-amber-300">Trịnh Quốc Nghiêm</span> <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline-block" />
          </p>
        </div>
      </div>
    </footer>
  );
};
