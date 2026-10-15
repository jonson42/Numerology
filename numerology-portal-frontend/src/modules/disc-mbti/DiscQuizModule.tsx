import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle2, ArrowRight, RotateCcw, Loader2, Sparkles, Award } from 'lucide-react';
import { quizApi } from '../../api/quizApi';
import type { DiscQuestion, DiscResultDto } from '../../types/quiz.types';

export const DiscQuizModule: React.FC = () => {
  const [questions, setQuestions] = useState<DiscQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTraits, setSelectedTraits] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiscResultDto | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const res = await quizApi.getDiscQuestions();
      if (res.success && res.data) {
        setQuestions(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectOption = (trait: string) => {
    setSelectedTraits(prev => ({
      ...prev,
      [currentIndex]: trait
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const traitsList = Object.values(selectedTraits);
    if (traitsList.length < questions.length) {
      alert('Vui lòng trả lời tất cả các câu hỏi trước khi nộp bài.');
      return;
    }

    setLoading(true);
    try {
      const res = await quizApi.submitDisc(traitsList);
      if (res.success && res.data) {
        setResult(res.data);
      }
    } catch (err: any) {
      alert(err?.message || 'Có lỗi khi chấm điểm trắc nghiệm DISC.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedTraits({});
    setCurrentIndex(0);
    setResult(null);
  };

  if (result) {
    return (
      <div className="max-w-4xl mx-auto glass-card rounded-3xl p-6 sm:p-10 border border-purple-500/30 space-y-8">
        <div className="text-center space-y-2">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 inline-flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" /> Kết Quả Trắc Nghiệm Tính Cách DISC
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-amber-300">
            {result.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            {result.overview}
          </p>
        </div>

        {/* 4 Nhóm Điểm Phần Trăm D - I - S - C */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-center">
            <span className="text-xs font-bold text-rose-300 block">D - Thống Trị</span>
            <span className="text-3xl font-bold font-mono text-rose-400 mt-1 block">{result.percentD}%</span>
            <span className="text-[10px] text-slate-400">{result.scoreD} câu chọn</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-center">
            <span className="text-xs font-bold text-amber-300 block">I - Ảnh Hưởng</span>
            <span className="text-3xl font-bold font-mono text-amber-400 mt-1 block">{result.percentI}%</span>
            <span className="text-[10px] text-slate-400">{result.scoreI} câu chọn</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center">
            <span className="text-xs font-bold text-emerald-300 block">S - Kiên Định</span>
            <span className="text-3xl font-bold font-mono text-emerald-400 mt-1 block">{result.percentS}%</span>
            <span className="text-[10px] text-slate-400">{result.scoreS} câu chọn</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-center">
            <span className="text-xs font-bold text-blue-300 block">C - Tuân Thủ</span>
            <span className="text-3xl font-bold font-mono text-blue-400 mt-1 block">{result.percentC}%</span>
            <span className="text-[10px] text-slate-400">{result.scoreC} câu chọn</span>
          </div>
        </div>

        {/* Chi tiết Điểm mạnh / Điểm yếu / Nghề nghiệp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
              ✓ Thế Mạnh Nổi Bật
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {result.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
              ⚠️ Điểm Cần Rèn Luyện
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {result.weaknesses.map((w, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Nghề nghiệp phù hợp */}
        <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
          <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wider">
            💼 Nghề Nghiệp & Vị Trí Lý Tưởng
          </h4>
          <div className="flex flex-wrap gap-2 pt-1">
            {result.suitableCareers.map((c, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-200 border border-purple-500/30">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition"
          >
            <RotateCcw className="w-4 h-4" /> Làm lại bài trắc nghiệm
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progressPercent = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto glass-card rounded-3xl p-6 sm:p-10 border border-purple-500/30 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 inline-flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-400" /> Trắc Nghiệm Tính Cách DISC Chuẩn Quốc Tế
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white mt-1">
            Khám Phá Bản Thân & Phong Cách Giao Tiếp
          </h2>
        </div>
        <span className="text-xs font-mono text-purple-300 font-bold">
          Câu {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Thanh tiến trình */}
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-purple-500 to-amber-400 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {currentQ && (
        <div className="space-y-4 pt-2">
          <h3 className="text-base sm:text-lg font-semibold text-slate-100">
            {currentQ.scenario}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((opt) => {
              const isSelected = selectedTraits[currentIndex] === opt.trait;
              return (
                <div
                  key={opt.trait}
                  onClick={() => handleSelectOption(opt.trait)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-900/60 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)] text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-medium leading-relaxed">
                    {opt.text}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                      isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Nút điều hướng */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-300 transition cursor-pointer"
        >
          Câu trước
        </button>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedTraits[currentIndex]}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition flex items-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Xem Kết Quả DISC
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!selectedTraits[currentIndex]}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            Câu tiếp theo <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
