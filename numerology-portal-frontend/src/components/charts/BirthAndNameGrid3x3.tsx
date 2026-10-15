import React, { useState } from 'react';
import type { BirthChartGridData } from '../../types/report.types';
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  gridData: BirthChartGridData;
}

export const BirthAndNameGrid3x3: React.FC<Props> = ({ gridData }) => {
  const [selectedArrow, setSelectedArrow] = useState<string | null>(null);

  // Ma trận 3x3 chuẩn Pythagoras:
  // Hàng 1 (Tâm trí): 3 - 6 - 9
  // Hàng 2 (Tâm hồn): 2 - 5 - 8
  // Hàng 3 (Thể chất): 1 - 4 - 7
  const matrixLayout = [
    [3, 6, 9],
    [2, 5, 8],
    [1, 4, 7]
  ];

  const getDigitCount = (num: number) => {
    return gridData.birthDateCounts?.[num] || 0;
  };

  const renderCellNumber = (num: number) => {
    const count = getDigitCount(num);
    if (count === 0) {
      return <span className="text-slate-600/50 font-mono text-xl">{num}</span>;
    }
    // Lặp lại số theo số lần xuất hiện (VD: 11, 999...)
    const repeated = String(num).repeat(count);
    return (
      <span className="text-amber-300 font-bold font-mono text-xl sm:text-2xl drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
        {repeated}
      </span>
    );
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-purple-200 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Biểu Đồ Ngày Sinh (Lưới 3x3 Pythagoras)
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Trục Tâm trí (3-6-9) • Trục Tâm hồn (2-5-8) • Trục Thể chất (1-4-7)
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Có thế mạnh
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Điểm rèn luyện
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Lưới 3x3 SVG & Container */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] bg-slate-950/60 rounded-2xl p-3 border border-purple-500/30 shadow-[0_0_30px_rgba(147,51,234,0.15)]">
            {/* Lưới 9 ô */}
            <div className="grid grid-cols-3 grid-rows-3 h-full w-full gap-2 relative z-10">
              {matrixLayout.map((row, rIdx) =>
                row.map((num, cIdx) => {
                  const count = getDigitCount(num);
                  const isIsolated = gridData.isolatedNumbers?.includes(num);

                  return (
                    <div
                      key={num}
                      className={`relative flex flex-col items-center justify-center rounded-xl transition-all duration-300 ${
                        count > 0
                          ? 'bg-gradient-to-br from-purple-900/40 to-slate-900/80 border border-purple-500/40 shadow-inner'
                          : 'bg-slate-900/30 border border-slate-800/60'
                      }`}
                    >
                      <span className="absolute top-1.5 left-2 text-[10px] text-slate-500 font-medium">
                        Ô {num}
                      </span>
                      {renderCellNumber(num)}
                      {count > 0 && (
                        <span className="text-[10px] text-purple-300/80 mt-0.5">
                          {count} lần
                        </span>
                      )}
                      {isIsolated && (
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          Cô lập
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* SVG Overlays vẽ các đường kẻ mũi tên */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 p-3" viewBox="0 0 320 320">
              {/* Nếu có mũi tên 1-2-3 (hàng dọc 1) */}
              {gridData.strengthArrows?.some(a => a.code === '1-2-3') && (
                <line x1="55" y1="280" x2="55" y2="40" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 3" />
              )}
              {/* Nếu có mũi tên 4-5-6 (hàng dọc 2) */}
              {gridData.strengthArrows?.some(a => a.code === '4-5-6') && (
                <line x1="160" y1="280" x2="160" y2="40" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 3" />
              )}
              {/* Nếu có mũi tên 7-8-9 (hàng dọc 3) */}
              {gridData.strengthArrows?.some(a => a.code === '7-8-9') && (
                <line x1="265" y1="280" x2="265" y2="40" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 3" />
              )}
              {/* Nếu có mũi tên 3-6-9 (hàng ngang 1) */}
              {gridData.strengthArrows?.some(a => a.code === '3-6-9') && (
                <line x1="30" y1="55" x2="290" y2="55" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 3" />
              )}
              {/* Nếu có mũi tên 2-5-8 (hàng ngang 2) */}
              {gridData.strengthArrows?.some(a => a.code === '2-5-8') && (
                <line x1="30" y1="160" x2="290" y2="160" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 3" />
              )}
              {/* Nếu có mũi tên 1-4-7 (hàng ngang 3) */}
              {gridData.strengthArrows?.some(a => a.code === '1-4-7') && (
                <line x1="30" y1="265" x2="290" y2="265" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 3" />
              )}
              {/* Chéo 1-5-9 */}
              {gridData.strengthArrows?.some(a => a.code === '1-5-9') && (
                <line x1="50" y1="270" x2="270" y2="50" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 3" />
              )}
              {/* Chéo 3-5-7 */}
              {gridData.strengthArrows?.some(a => a.code === '3-5-7') && (
                <line x1="50" y1="50" x2="270" y2="270" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 3" />
              )}
            </svg>
          </div>
        </div>

        {/* Phân tích danh sách mũi tên */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Mũi Tên Cá Tính & Thế Mạnh Sở Hữu ({gridData.strengthArrows?.length || 0})
            </h4>
            {gridData.strengthArrows && gridData.strengthArrows.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {gridData.strengthArrows.map(arrow => (
                  <div
                    key={arrow.code}
                    onClick={() => setSelectedArrow(selectedArrow === arrow.code ? null : arrow.code)}
                    className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-400/60 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300">{arrow.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                        {arrow.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">{arrow.meaning}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Bản đồ ngày sinh phân bổ đều, không tạo mũi tên 3 số liền kề.</p>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Mũi Tên Trống Cần Rèn Luyện ({gridData.weaknessArrows?.length || 0})
            </h4>
            {gridData.weaknessArrows && gridData.weaknessArrows.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {gridData.weaknessArrows.map(arrow => (
                  <div
                    key={arrow.code}
                    className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 hover:border-amber-400/60 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300">{arrow.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                        {arrow.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">{arrow.meaning}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-emerald-400">Rất tốt! Bạn không có mũi tên trống nào bị khuyết thiếu nghiêm trọng.</p>
            )}
          </div>

          {gridData.isolatedNumbers && gridData.isolatedNumbers.length > 0 && (
            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
              <span className="font-bold">⚠️ Con số bị cô lập:</span>
              Số {gridData.isolatedNumbers.join(', ')} bị bao quanh bởi các ô trống, cần chú ý phát triển khả năng giao tiếp và kết nối với môi trường xung quanh.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
