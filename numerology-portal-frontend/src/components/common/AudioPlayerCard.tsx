import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, FastForward, Headphones } from 'lucide-react';

interface Props {
  lifePathNumber: number;
  fullName: string;
  narratorText?: string;
}

export const AudioPlayerCard: React.FC<Props> = ({
  lifePathNumber,
  fullName,
  narratorText
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const defaultText = narratorText || `Chào bạn ${fullName}. Bản đồ thần số học chỉ ra rằng bạn mang con số chủ đạo ${lifePathNumber}. Đây là con số đại diện cho sứ mệnh tiên phong, năng lực hành động vượt trội và những cơ hội hoàng kim lớn đang chờ đón bạn. Hãy lắng nghe thông điệp vũ trụ để thấu hiểu vận mệnh của mình.`;

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1 * playbackRate;
        });
      }, 300);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackRate]);

  const togglePlay = () => {
    if ('speechSynthesis' in window) {
      if (!isPlaying) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(defaultText);
        utterance.lang = 'vi-VN';
        utterance.rate = playbackRate;
        utterance.onend = () => {
          setIsPlaying(false);
          setProgress(0);
        };
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      } else {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleRateChange = () => {
    const nextRate = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1;
    setPlaybackRate(nextRate);
    if (isPlaying && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(defaultText);
      utterance.lang = 'vi-VN';
      utterance.rate = nextRate;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-indigo-950/40 shadow-[0_0_25px_rgba(147,51,234,0.15)] mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tiêu đề & Thông tin Audio */}
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
            <Headphones className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Thuyết Minh AI
              </span>
              <span className="text-xs text-slate-400">Giọng đọc bản mệnh</span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-slate-100 mt-0.5">
              Luận giải Số Chủ Đạo {lifePathNumber} của {fullName}
            </h4>
          </div>
        </div>

        {/* Thanh phát & Điều khiển */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Nút Play / Pause */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center hover:scale-105 transition shadow-[0_0_15px_rgba(147,51,234,0.4)] cursor-pointer shrink-0"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          {/* Thanh tiến trình giả lập */}
          <div className="w-32 sm:w-44 bg-slate-800 h-2 rounded-full overflow-hidden relative">
            <div
              className="bg-gradient-to-r from-purple-500 to-amber-400 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Tốc độ đọc */}
          <button
            onClick={handleRateChange}
            className="px-2 py-1 rounded bg-slate-800 text-[11px] font-mono text-purple-300 hover:text-white transition cursor-pointer"
          >
            {playbackRate}x
          </button>

          {/* Âm thanh */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 text-slate-400 hover:text-white transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
