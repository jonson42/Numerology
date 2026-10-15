import React, { useState } from 'react';
import type { PyramidPeakData } from '../../types/report.types';
import { Mountain, Compass } from 'lucide-react';

interface Props {
  pyramidData: PyramidPeakData;
}

export const NumerologyPyramidSvg: React.FC<Props> = ({ pyramidData }) => {
  const [activePeak, setActivePeak] = useState<number>(1);

  const peaks = pyramidData?.peaks || [];
  const challenges = pyramidData?.challenges || [];

  const p1 = peaks.find(p => p.peakIndex === 1);
  const p2 = peaks.find(p => p.peakIndex === 2);
  const p3 = peaks.find(p => p.peakIndex === 3);
  const p4 = peaks.find(p => p.peakIndex === 4);

  const activePeakObj = peaks.find(p => p.peakIndex === activePeak) || p1;

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold font-cinzel text-purple-200 flex items-center gap-2">
            <Mountain className="w-5 h-5 text-amber-400" />
            Kim Tự Tháp 4 Đỉnh Cao Cuộc Đời & 4 Thử Thách
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Mỗi đỉnh cao đại diện cho 9 năm hoàng kim rực rỡ nhất trong từng chặng đường phát triển
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map(idx => (
            <button
              key={idx}
              onClick={() => setActivePeak(idx)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activePeak === idx
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              Đỉnh {idx}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SVG Kim Tự Tháp hình học 4 đỉnh */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-[420px] aspect-[4/3] relative">
            <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              {/* Định nghĩa gradient */}
              <defs>
                <linearGradient id="pyramidGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9333ea" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b0764" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="pyramidGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Các đường kết nối tam giác */}
              {/* Tam giác đỉnh 1 (Trái): Base trái (80, 240) -> Đỉnh 1 (130, 150) -> Base giữa (200, 240) */}
              <polygon points="60,240 140,150 200,240" fill="url(#pyramidGrad1)" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 2" />

              {/* Tam giác đỉnh 2 (Phải): Base giữa (200, 240) -> Đỉnh 2 (260, 150) -> Base phải (340, 240) */}
              <polygon points="200,240 260,150 340,240" fill="url(#pyramidGrad2)" stroke="#818cf8" strokeWidth="2" strokeDasharray="4 2" />

              {/* Tam giác đỉnh 3 (Giữa tầng 2): Đỉnh 1 (140, 150) -> Đỉnh 3 (200, 80) -> Đỉnh 2 (260, 150) */}
              <polygon points="140,150 200,85 260,150" fill="url(#pyramidGrad1)" stroke="#f59e0b" strokeWidth="2.5" />

              {/* Tam giác đỉnh 4 (Đỉnh tối cao): Đỉnh 3 (200, 85) -> Đỉnh 4 (200, 25) */}
              <line x1="200" y1="85" x2="200" y2="25" stroke="#ec4899" strokeWidth="3" strokeDasharray="3 3" />
              <line x1="60" y1="240" x2="200" y2="25" stroke="#ec4899" strokeWidth="1.5" strokeOpacity="0.4" />
              <line x1="340" y1="240" x2="200" y2="25" stroke="#ec4899" strokeWidth="1.5" strokeOpacity="0.4" />

              {/* Đỉnh 4 (Tối Cao) */}
              <g className="cursor-pointer" onClick={() => setActivePeak(4)}>
                <circle cx="200" cy="25" r="18" fill="#1e1136" stroke="#ec4899" strokeWidth="3" />
                <text x="200" y="31" textAnchor="middle" fill="#f472b6" fontSize="14" fontWeight="bold" fontFamily="monospace">
                  {p4?.value ?? '-'}
                </text>
                <text x="200" y="8" textAnchor="middle" fill="#fbcfe8" fontSize="10" fontWeight="600">
                  Đỉnh 4 ({p4?.milestoneAge}t)
                </text>
              </g>

              {/* Đỉnh 3 (Tầng 2) */}
              <g className="cursor-pointer" onClick={() => setActivePeak(3)}>
                <circle cx="200" cy="85" r="18" fill="#1e1136" stroke="#f59e0b" strokeWidth="3" />
                <text x="200" y="91" textAnchor="middle" fill="#fbbf24" fontSize="14" fontWeight="bold" fontFamily="monospace">
                  {p3?.value ?? '-'}
                </text>
                <text x="200" y="115" textAnchor="middle" fill="#fde68a" fontSize="10" fontWeight="600">
                  Đỉnh 3 ({p3?.milestoneAge}t)
                </text>
              </g>

              {/* Đỉnh 1 (Tầng 1 Trái) */}
              <g className="cursor-pointer" onClick={() => setActivePeak(1)}>
                <circle cx="140" cy="150" r="17" fill="#1e1136" stroke="#a855f7" strokeWidth="3" />
                <text x="140" y="156" textAnchor="middle" fill="#c084fc" fontSize="13" fontWeight="bold" fontFamily="monospace">
                  {p1?.value ?? '-'}
                </text>
                <text x="100" y="155" textAnchor="middle" fill="#e9d5ff" fontSize="10" fontWeight="600">
                  Đỉnh 1 ({p1?.milestoneAge}t)
                </text>
              </g>

              {/* Đỉnh 2 (Tầng 1 Phải) */}
              <g className="cursor-pointer" onClick={() => setActivePeak(2)}>
                <circle cx="260" cy="150" r="17" fill="#1e1136" stroke="#818cf8" strokeWidth="3" />
                <text x="260" y="156" textAnchor="middle" fill="#a5b4fc" fontSize="13" fontWeight="bold" fontFamily="monospace">
                  {p2?.value ?? '-'}
                </text>
                <text x="300" y="155" textAnchor="middle" fill="#e0e7ff" fontSize="10" fontWeight="600">
                  Đỉnh 2 ({p2?.milestoneAge}t)
                </text>
              </g>

              {/* Đáy Kim Tự Tháp (Tháng - Ngày - Năm) */}
              <circle cx="60" cy="240" r="10" fill="#334155" />
              <text x="60" y="260" textAnchor="middle" fill="#94a3b8" fontSize="10">Tháng sinh</text>

              <circle cx="200" cy="240" r="10" fill="#334155" />
              <text x="200" y="260" textAnchor="middle" fill="#94a3b8" fontSize="10">Ngày sinh</text>

              <circle cx="340" cy="240" r="10" fill="#334155" />
              <text x="340" y="260" textAnchor="middle" fill="#94a3b8" fontSize="10">Năm sinh</text>
            </svg>
          </div>
        </div>

        {/* Thông tin luận giải đỉnh cao đang chọn */}
        <div className="lg:col-span-6 space-y-4">
          {activePeakObj && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/30 via-slate-900/70 to-slate-950 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {activePeakObj.title}
                </span>
                <span className="text-2xl font-bold font-mono text-amber-300">
                  Số {activePeakObj.value}
                </span>
              </div>
              <p className="text-sm text-slate-200 mt-3 leading-relaxed">
                {activePeakObj.description}
              </p>
            </div>
          )}

          {/* 4 Thử thách (Challenges) */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> 4 Thử Thách Cần Vượt Qua
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {challenges.map(c => (
                <div key={c.challengeIndex} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-300">Thử thách {c.challengeIndex}</span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                      Số {c.value}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
