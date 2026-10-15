import React, { useState } from 'react';
import type { PersonalCycleYear } from '../../types/report.types';
import { Activity, Calendar } from 'lucide-react';

interface Props {
  waveData: PersonalCycleYear[];
}

export const LifeCycleWaveChart: React.FC<Props> = ({ waveData }) => {
  const currentItem = waveData.find(w => w.isCurrentYear) || waveData[0];
  const [selectedYear, setSelectedYear] = useState<PersonalCycleYear>(currentItem);

  if (!waveData || waveData.length === 0) return null;

  // Tọa độ tính toán cho đồ thị hình sin SVG (width: 700, height: 220)
  // X: chia đều cho các năm
  // Y: năm 9 (đỉnh), năm 8 (cao), năm 1 (cao), năm 4 và 7 (đáy)
  const getYCoordinate = (num: number) => {
    // num từ 1..9
    // Biến đổi đường sóng: Năm 1 cao (90), Năm 2-3 lên dốc, Năm 4 võng đáy (170), Năm 5-6 hồi phục, Năm 7 võng nhẹ (160), Năm 8-9 đỉnh cao (40-50)
    const curveMap: Record<number, number> = {
      1: 90,
      2: 120,
      3: 80,
      4: 175, // Đáy trũng củng cố nội lực
      5: 110,
      6: 85,
      7: 165, // Đáy trũng chiêm nghiệm tri thức
      8: 55,  // Đỉnh cao tài chính
      9: 40   // Đỉnh cao hoàn tất chuyển giao
    };
    return curveMap[num] || 110;
  };

  const points = waveData.map((item, index) => {
    const x = 50 + index * ((650 - 50) / (waveData.length - 1));
    const y = getYCoordinate(item.personalYearNumber);
    return { ...item, x, y };
  });

  // Tạo đường dẫn cong SVG mượt mà (Smooth Bezier)
  const pathD = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (pt.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (pt.x - prev.x) / 2;
    const cpY2 = pt.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pt.x} ${pt.y}`;
  }, '');

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-purple-200 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            Đồ Thị Chu Kỳ Vận Số 9 Năm (Sóng Năng Lượng Vũ Trụ)
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Bấm vào từng năm trên đồ thị hình sin để xem dự báo chi tiết vận trình tương lai
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            Hiện tại: Năm {currentItem.year} (Số {currentItem.personalYearNumber})
          </span>
        </div>
      </div>

      {/* SVG Sóng hình sin */}
      <div className="w-full overflow-x-auto py-2">
        <div className="min-w-[650px] relative">
          <svg viewBox="0 0 700 230" className="w-full h-48 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="50%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            {/* Các đường lưới ngang phụ */}
            <line x1="30" y1="40" x2="670" y2="40" stroke="#334155" strokeWidth="0.8" strokeDasharray="4 4" />
            <text x="35" y="36" fill="#64748b" fontSize="9">Đỉnh cao (Năm 8, 9)</text>

            <line x1="30" y1="110" x2="670" y2="110" stroke="#334155" strokeWidth="0.8" strokeDasharray="4 4" />
            <text x="35" y="106" fill="#64748b" fontSize="9">Chuyển biến (Năm 2, 5)</text>

            <line x1="30" y1="175" x2="670" y2="175" stroke="#334155" strokeWidth="0.8" strokeDasharray="4 4" />
            <text x="35" y="171" fill="#64748b" fontSize="9">Đáy củng cố nội lực (Năm 4, 7)</text>

            {/* Đường cong hình sin chính */}
            <path d={pathD} fill="none" stroke="url(#waveGradient)" strokeWidth="3.5" strokeLinecap="round" />

            {/* Các điểm nút (Nodes) */}
            {points.map(pt => {
              const isSelected = selectedYear?.year === pt.year;
              const isCurrent = pt.isCurrentYear;

              return (
                <g
                  key={pt.year}
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => setSelectedYear(pt)}
                >
                  {/* Quầng sáng nếu là năm hiện tại hoặc đang chọn */}
                  {(isCurrent || isSelected) && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="16"
                      fill={isCurrent ? '#f59e0b' : '#a855f7'}
                      fillOpacity="0.25"
                      className="animate-pulse"
                    />
                  )}

                  {/* Vòng tròn điểm nút */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? '9' : '7'}
                    fill="#0f0b24"
                    stroke={isCurrent ? '#f59e0b' : isSelected ? '#c084fc' : '#818cf8'}
                    strokeWidth="3"
                  />

                  {/* Con số năm cá nhân trên đỉnh điểm nút */}
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    textAnchor="middle"
                    fill={isCurrent ? '#fde68a' : '#e2e8f0'}
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    Số {pt.personalYearNumber}
                  </text>

                  {/* Năm dương lịch dưới đáy */}
                  <text
                    x={pt.x}
                    y="215"
                    textAnchor="middle"
                    fill={isCurrent ? '#f59e0b' : isSelected ? '#e9d5ff' : '#94a3b8'}
                    fontSize="11"
                    fontWeight={isCurrent ? 'bold' : 'normal'}
                  >
                    {pt.year}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Thẻ chi tiết năm đang chọn */}
      {selectedYear && (
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-slate-950 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <h4 className="font-bold text-amber-300 text-base">
                {selectedYear.phase} (Năm {selectedYear.year})
              </h4>
              {selectedYear.isCurrentYear && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                  Năm này
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {selectedYear.description}
            </p>
          </div>

          <div className="shrink-0 px-4 py-2.5 rounded-xl bg-purple-900/30 border border-purple-500/30 text-center">
            <span className="text-[10px] uppercase text-purple-300 block">Năng lượng</span>
            <span className="text-xl font-bold font-mono text-purple-200">
              Số {selectedYear.personalYearNumber}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
