import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Award, ArrowRight, RotateCcw, Loader2, Heart } from 'lucide-react';
import { quizApi } from '../../api/quizApi';
import type { MbtiQuestion, MbtiResultDto } from '../../types/quiz.types';

export const MbtiQuizModule: React.FC = () => {
  const [questions, setQuestions] = useState<MbtiQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MbtiResultDto | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const res = await quizApi.getMbtiQuestions();
      if (res.success && res.data) {
        setQuestions(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (val: string) => {
    const q = questions[currentIndex];
    setAnswers(prev => ({
      ...prev,
      [q.id.toString()]: val
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
    if (Object.keys(answers).length < questions.length) {
      alert('Vui lòng trả lời toàn bộ các câu hỏi để có kết quả chính xác nhất.');
      return;
    }

    setLoading(true);
    try {
      const res = await quizApi.submitMbti(answers);
      if (res.success && res.data) {
        setResult(res.data);
      }
    } catch (err: any) {
      alert(err?.message || 'Có lỗi khi phân tích MBTI.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
  };

  if (result) {
    return (
      <div className="max-w-4xl mx-auto glass-card rounded-3xl p-6 sm:p-10 border border-purple-500/30 space-y-8">
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 inline-flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-cyan-400" /> Kết Quả Trắc Nghiệm Tính Cách MBTI (16 Nhóm)
          </span>

          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 p-1 mx-auto shadow-[0_0_40px_rgba(168,85,247,0.4)]">
            <div className="w-full h-full bg-[#0a0720] rounded-3xl flex items-center justify-center">
              <span className="font-extrabold font-mono text-3xl text-amber-300">
                {result.code}
              </span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-white">
            {result.title}
          </h2>
          <span className="text-sm font-semibold text-purple-300 block">
            "{result.nickname}"
          </span>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            {result.overview}
          </p>
        </div>

        {/* 4 Chiều Kích Tính Cách (E/I, S/N, T/F, J/P) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className={result.code.includes('E') ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                Hướng ngoại (E): {result.scoreE}
              </span>
              <span className={result.code.includes('I') ? 'text-purple-400 font-bold' : 'text-slate-500'}>
                Hướng nội (I): {result.scoreI}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
              <div
                className="bg-amber-400 h-full"
                style={{ width: `${Math.round((result.scoreE / Math.max(1, result.scoreE + result.scoreI)) * 100)}%` }}
              />
              <div
                className="bg-purple-500 h-full"
                style={{ width: `${Math.round((result.scoreI / Math.max(1, result.scoreE + result.scoreI)) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className={result.code.includes('S') ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                Thực tế (S): {result.scoreS}
              </span>
              <span className={result.code.includes('N') ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                Trực giác (N): {result.scoreN}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
              <div
                className="bg-amber-400 h-full"
                style={{ width: `${Math.round((result.scoreS / Math.max(1, result.scoreS + result.scoreN)) * 100)}%` }}
              />
              <div
                className="bg-cyan-400 h-full"
                style={{ width: `${Math.round((result.scoreN / Math.max(1, result.scoreS + result.scoreN)) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className={result.code.includes('T') ? 'text-blue-400 font-bold' : 'text-slate-500'}>
                Lý trí (T): {result.scoreT}
              </span>
              <span className={result.code.includes('F') ? 'text-pink-400 font-bold' : 'text-slate-500'}>
                Cảm xúc (F): {result.scoreF}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
              <div
                className="bg-blue-400 h-full"
                style={{ width: `${Math.round((result.scoreT / Math.max(1, result.scoreT + result.scoreF)) * 100)}%` }}
              />
              <div
                className="bg-pink-400 h-full"
                style={{ width: `${Math.round((result.scoreF / Math.max(1, result.scoreT + result.scoreF)) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className={result.code.includes('J') ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                Nguyên tắc (J): {result.scoreJ}
              </span>
              <span className={result.code.includes('P') ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                Linh hoạt (P): {result.scoreP}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-400 h-full"
                style={{ width: `${Math.round((result.scoreJ / Math.max(1, result.scoreJ + result.scoreP)) * 100)}%` }}
              />
              <div
                className="bg-amber-400 h-full"
                style={{ width: `${Math.round((result.scoreP / Math.max(1, result.scoreJ + result.scoreP)) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Điểm mạnh & Điểm yếu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
              ✓ Thế Mạnh Tiêu Biểu
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
              ⚠️ Điểm Cần Chú Ý
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

        {/* Nghề nghiệp & Tương thích */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
            <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wider">
              💼 Nghề Nghiệp Thích Hợp
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {result.suitableCareers.map((c, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-200 border border-purple-500/30">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-pink-950/30 border border-pink-500/30 space-y-2">
            <h4 className="text-sm font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-pink-400 fill-current" /> Nhóm Tính Cách Hợp Cạ Nhất
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {result.compatibleTypes.map((ct, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  {ct}
                </span>
              ))}
            </div>
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
  const currentAnswer = currentQ ? answers[currentQ.id.toString()] : null;

  return (
    <div className="max-w-3xl mx-auto glass-card rounded-3xl p-6 sm:p-10 border border-purple-500/30 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 inline-flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-cyan-400" /> Trắc Nghiệm Tính Cách MBTI 16 Nhóm
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white mt-1">
            Khám Phá Khí Chất Tâm Lý Cốt Lõi
          </h2>
        </div>
        <span className="text-xs font-mono text-purple-300 font-bold">
          Câu {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {currentQ && (
        <div className="space-y-4 pt-2">
          <h3 className="text-base sm:text-lg font-semibold text-slate-100">
            {currentQ.prompt}
          </h3>

          <div className="space-y-3">
            {/* Lựa chọn A */}
            <div
              onClick={() => handleSelect(currentQ.valueA)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                currentAnswer === currentQ.valueA
                  ? 'bg-purple-900/60 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)] text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-purple-300 shrink-0">
                  A
                </span>
                <span className="text-xs sm:text-sm font-medium leading-relaxed">
                  {currentQ.optionA}
                </span>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                  currentAnswer === currentQ.valueA ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                }`}
              >
                {currentAnswer === currentQ.valueA && <div className="w-2 h-2 rounded-full bg-slate-950" />}
              </div>
            </div>

            {/* Lựa chọn B */}
            <div
              onClick={() => handleSelect(currentQ.valueB)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                currentAnswer === currentQ.valueB
                  ? 'bg-purple-900/60 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)] text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-purple-300 shrink-0">
                  B
                </span>
                <span className="text-xs sm:text-sm font-medium leading-relaxed">
                  {currentQ.optionB}
                </span>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                  currentAnswer === currentQ.valueB ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                }`}
              >
                {currentAnswer === currentQ.valueB && <div className="w-2 h-2 rounded-full bg-slate-950" />}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Điều hướng */}
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
            disabled={loading || !currentAnswer}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition flex items-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Xem Kết Quả MBTI
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!currentAnswer}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            Câu tiếp theo <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
