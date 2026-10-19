import React, { useState } from 'react';
import type { LookupReportDto } from '../types/report.types';
import { reportApi } from '../api/reportApi';
import { BirthAndNameGrid3x3 } from '../components/charts/BirthAndNameGrid3x3';
import { NumerologyPyramidSvg } from '../components/charts/NumerologyPyramidSvg';
import { LifeCycleWaveChart } from '../components/charts/LifeCycleWaveChart';
import { VipLockedOverlay } from '../components/paywall/VipLockedOverlay';
import {
  Sparkles,
  Download,
  Share2,
  Calendar,
  User,
  Crown,
  ChevronRight,
  ShieldCheck,
  Check,
  Lock,
  ArrowLeft
} from 'lucide-react';

interface Props {
  report: LookupReportDto;
  onOpenUpgradeVip: () => void;
  onBackToLookup: () => void;
}

export const ReportViewPage: React.FC<Props> = ({
  report,
  onOpenUpgradeVip,
  onBackToLookup,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const { metrics, fullName, birthDate, shareToken, isVipView } = report;

  const handleShare = () => {
    const url = `${window.location.origin}?view=${shareToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPdf = () => {
    const pdfUrl = reportApi.getPdfUrl(shareToken);
    window.open(pdfUrl, '_blank');
  };

  const categories = ['ALL', 'Cốt lõi', 'Tiềm năng', 'Vận hạn', 'Nghiệp quả'];

  const filteredIndicators = metrics.detailedIndicators.filter(ind => {
    if (activeCategory === 'ALL') return true;
    return ind.category === activeCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Nút quay lại & Thanh chia sẻ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBackToLookup}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-purple-300 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại form tra cứu
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShare}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            {copied ? 'Đã sao chép link' : 'Chia sẻ báo cáo'}
          </button>

          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            Tải Bản PDF Báo Cáo
          </button>

          {!isVipView && (
            <button
              onClick={onOpenUpgradeVip}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 hover:brightness-110 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5" /> Mở VIP (199k)
            </button>
          )}
        </div>
      </div>

      {/* Hero Header Thông Tin Bản Mệnh */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden border border-purple-500/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Bản Đồ Thần Số Học Pythagoras
              </span>
              {isVipView ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ★ Bản Đầy Đủ VIP
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400">
                  Bản Tra Cứu Miễn Phí
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-cinzel text-white">
              {fullName}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-400" />
                Ngày sinh: <strong className="text-white">{new Date(birthDate).toLocaleDateString('vi-VN')}</strong>
              </span>
              {report.gender && (
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-purple-400" />
                  Giới tính: <strong className="text-white">{report.gender}</strong>
                </span>
              )}
              <span className="text-slate-500 font-mono">
                Mã tra cứu: #{shareToken}
              </span>
            </div>
          </div>

          {/* 4 Huy hiệu chỉ số cốt lõi nổi bật */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            {/* Số chủ đạo */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-900/60 to-slate-900 border border-purple-500/40 text-center">
              <span className="text-[10px] text-purple-300 uppercase tracking-wider block font-semibold">
                Số Chủ Đạo
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                {metrics.lifePathNumber}
              </span>
            </div>

            {/* Sứ mệnh */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-900/60 to-slate-900 border border-indigo-500/40 text-center">
              <span className="text-[10px] text-indigo-300 uppercase tracking-wider block font-semibold">
                Sứ Mệnh
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                {metrics.destinyNumber}
              </span>
            </div>

            {/* Linh hồn */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-pink-900/60 to-slate-900 border border-pink-500/40 text-center">
              <span className="text-[10px] text-pink-300 uppercase tracking-wider block font-semibold">
                Linh Hồn
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-pink-300 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">
                {metrics.soulUrgeNumber}
              </span>
            </div>

            {/* Thái độ */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-900/60 to-slate-900 border border-amber-500/40 text-center">
              <span className="text-[10px] text-amber-300 uppercase tracking-wider block font-semibold">
                Thái Độ
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-200">
                {metrics.attitudeNumber}
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* 3 Biểu Đồ Trực Quan Chuyên Sâu */}
      <div className="space-y-8">
        {/* 1. Lưới 3x3 */}
        <BirthAndNameGrid3x3 gridData={metrics.birthChartGrid} />

        {/* 2. Kim Tự Tháp 4 Đỉnh Cao */}
        <NumerologyPyramidSvg pyramidData={metrics.pyramidPeaks} />

        {/* 3. Đồ Thị Sóng Chu Kỳ 9 Năm */}
        <LifeCycleWaveChart waveData={metrics.lifeCycleWave} />
      </div>

      {/* Danh Sách 26+ Chỉ Số Luận Giải Chi Tiết */}
      <div className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-cinzel text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              Toàn Bộ 26+ Chỉ Số Luận Giải Chi Tiết
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Phân tích đa chiều về tính cách, cơ hội, thử thách và vận hạn cuộc đời
            </p>
          </div>

          {/* Bộ lọc phân loại */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.4)]'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat === 'ALL' ? 'Tất cả chỉ số' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Danh sách thẻ chỉ số */}
        <div className="space-y-4">
          {filteredIndicators.map((ind) => (
            <div
              key={ind.code}
              className={`glass-card rounded-2xl p-6 transition-all duration-300 border ${
                ind.isLocked
                  ? 'border-amber-500/20 bg-slate-950/70'
                  : 'border-purple-500/30 hover:border-purple-500/60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center font-bold font-mono text-amber-300 text-base shrink-0">
                    {ind.value}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                      {ind.name}
                      {ind.isVipOnly && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Chuyên Sâu VIP
                        </span>
                      )}
                    </h3>
                    <span className="text-xs text-purple-300/80 font-medium">
                      Nhóm: {ind.category}
                    </span>
                  </div>
                </div>

                {ind.isLocked ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 self-start sm:self-auto">
                    <Lock className="w-3.5 h-3.5" /> Bị Khóa
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
                    <Check className="w-3.5 h-3.5" /> Đã Mở Khóa
                  </span>
                )}
              </div>

              {/* Nội dung luận giải hoặc Paywall Overlay */}
              {ind.isLocked ? (
                <VipLockedOverlay
                  title={`Luận giải chuyên sâu: ${ind.name}`}
                  onUnlockClick={onOpenUpgradeVip}
                />
              ) : (
                <div
                  className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed mt-3 space-y-2"
                  dangerouslySetInnerHTML={{ __html: ind.contentHtml }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
