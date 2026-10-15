import React, { useState } from 'react';
import { Moon, Sun, Sparkles, Compass, Heart, Calendar } from 'lucide-react';

interface ZodiacInfo {
  name: string;
  latin: string;
  dates: string;
  element: string; // Lửa, Đất, Khí, Nước
  rulingPlanet: string;
  symbol: string;
  traits: string[];
  loveMatch: string[];
  forecast2026: string;
}

export const AstrologyModule: React.FC = () => {
  const [birthDate, setBirthDate] = useState('1998-10-15');
  const [selectedZodiac, setSelectedZodiac] = useState<ZodiacInfo | null>(null);

  const zodiacList: ZodiacInfo[] = [
    {
      name: 'Bạch Dương',
      latin: 'Aries',
      dates: '21/03 - 19/04',
      element: 'Lửa',
      rulingPlanet: 'Sao Hỏa',
      symbol: '♈',
      traits: ['Nhiệt huyết', 'Dũng cảm', 'Tiên phong', 'Tự tin'],
      loveMatch: ['Sư Tử', 'Nhân Mã', 'Song Tử'],
      forecast2026: 'Năm 2026 đánh dấu bước đột phá ngoạn mục về công danh. Bạn có cơ hội thăng chức hoặc khởi nghiệp thuận buồm xuôi gió.'
    },
    {
      name: 'Kim Ngưu',
      latin: 'Taurus',
      dates: '20/04 - 20/05',
      element: 'Đất',
      rulingPlanet: 'Sao Kim',
      symbol: '♉',
      traits: ['Kiên định', 'Đáng tin cậy', 'Thực tế', 'Thẩm mỹ cao'],
      loveMatch: ['Xử Nữ', 'Ma Kết', 'Cự Giải'],
      forecast2026: 'Tài chính vững như bàn thạch. Năm nay thích hợp để tích lũy tài sản dài hạn, đầu tư bất động sản hoặc vàng.'
    },
    {
      name: 'Song Tử',
      latin: 'Gemini',
      dates: '21/05 - 20/06',
      element: 'Khí',
      rulingPlanet: 'Sao Thủy',
      symbol: '♊',
      traits: ['Linh hoạt', 'Hài hước', 'Ham học hỏi', 'Giao tiếp tốt'],
      loveMatch: ['Thiên Bình', 'Bảo Bình', 'Bạch Dương'],
      forecast2026: 'Mạng lưới quan hệ mở rộng đột biến. Nhiều cơ hội hợp tác xuyên biên giới và các dự án sáng tạo sinh lời.'
    },
    {
      name: 'Cự Giải',
      latin: 'Cancer',
      dates: '21/06 - 22/07',
      element: 'Nước',
      rulingPlanet: 'Mặt Trăng',
      symbol: '♋',
      traits: ['Giàu tình cảm', 'Chu đáo', 'Trực giác nhạy', 'Yêu gia đình'],
      loveMatch: ['Bọ Cạp', 'Song Ngư', 'Kim Ngưu'],
      forecast2026: 'Hạnh phúc gia đình thăng hoa. Người độc thân tìm thấy bến đỗ bình yên, người có gia đình đón nhận tin vui con cái.'
    },
    {
      name: 'Sư Tử',
      latin: 'Leo',
      dates: '23/07 - 22/08',
      element: 'Lửa',
      rulingPlanet: 'Mặt Trời',
      symbol: '♌',
      traits: ['Hào phóng', 'Quyến rũ', 'Lãnh đạo', 'Tự hào'],
      loveMatch: ['Bạch Dương', 'Nhân Mã', 'Thiên Bình'],
      forecast2026: 'Ánh hào quang rực rỡ! Vị thế xã hội của bạn được khẳng định vững chắc, là tâm điểm truyền cảm hứng cho đám đông.'
    },
    {
      name: 'Xử Nữ',
      latin: 'Virgo',
      dates: '23/08 - 22/09',
      element: 'Đất',
      rulingPlanet: 'Sao Thủy',
      symbol: '♍',
      traits: ['Tỉ mỉ', 'Ngăn nắp', 'Cầu toàn', 'Phân tích giỏi'],
      loveMatch: ['Kim Ngưu', 'Ma Kết', 'Bọ Cạp'],
      forecast2026: 'Kỹ năng chuyên môn đạt tới đỉnh cao nghệ thuật. Các dự án nghiên cứu hoặc công nghệ mang lại thành công vang dội.'
    },
    {
      name: 'Thiên Bình',
      latin: 'Libra',
      dates: '23/09 - 22/10',
      element: 'Khí',
      rulingPlanet: 'Sao Kim',
      symbol: '♎',
      traits: ['Công bằng', 'Duyên dáng', 'Hòa nhã', 'Thanh lịch'],
      loveMatch: ['Song Tử', 'Bảo Bình', 'Sư Tử'],
      forecast2026: 'Năm của những bản hợp đồng lớn và tình duyên viên mãn. Các mâu thuẫn cũ được hòa giải êm đẹp.'
    },
    {
      name: 'Bọ Cạp',
      latin: 'Scorpio',
      dates: '23/10 - 21/11',
      element: 'Nước',
      rulingPlanet: 'Sao Diêm Vương',
      symbol: '♏',
      traits: ['Sâu sắc', 'Bí ẩn', 'Kiên định', 'Nghị lực phi thường'],
      loveMatch: ['Cự Giải', 'Song Ngư', 'Xử Nữ'],
      forecast2026: 'Sự lột xác và chuyển hóa ngoạn mục. Bạn bỏ lại những gánh nặng cũ để trỗi dậy như phượng hoàng tái sinh.'
    },
    {
      name: 'Nhân Mã',
      latin: 'Sagittarius',
      dates: '22/11 - 21/12',
      element: 'Lửa',
      rulingPlanet: 'Sao Mộc',
      symbol: '♐',
      traits: ['Lạc quan', 'Yêu tự do', 'Phóng khoáng', 'Thẳng thắn'],
      loveMatch: ['Bạch Dương', 'Sư Tử', 'Bảo Bình'],
      forecast2026: 'Những chuyến đi xa đầy phước lành và mở rộng tri thức. Vận may tài chính từ các cơ hội bất ngờ ngoài dự kiến.'
    },
    {
      name: 'Ma Kết',
      latin: 'Capricorn',
      dates: '22/12 - 19/01',
      element: 'Đất',
      rulingPlanet: 'Sao Thổ',
      symbol: '♑',
      traits: ['Kỷ luật', 'Kiên nhẫn', 'Tham vọng', 'Thực tế'],
      loveMatch: ['Kim Ngưu', 'Xử Nữ', 'Song Ngư'],
      forecast2026: 'Gặt hái quả ngọt sau nhiều năm âm thầm cống hiến. Bạn bước lên nấc thang quyền lực và uy tín cao nhất.'
    },
    {
      name: 'Bảo Bình',
      latin: 'Aquarius',
      dates: '20/01 - 18/02',
      element: 'Khí',
      rulingPlanet: 'Sao Thiên Vương',
      symbol: '♒',
      traits: ['Độc lập', 'Sáng tạo đột phá', 'Nhân đạo', 'Dị biệt'],
      loveMatch: ['Song Tử', 'Thiên Bình', 'Nhân Mã'],
      forecast2026: 'Thời đại của Bảo Bình! Những ý tưởng đi trước thời đại của bạn được đón nhận nồng nhiệt và ứng dụng thực tế.'
    },
    {
      name: 'Song Ngư',
      latin: 'Pisces',
      dates: '19/02 - 20/03',
      element: 'Nước',
      rulingPlanet: 'Sao Hải Vương',
      symbol: '♓',
      traits: ['Trắc ẩn', 'Nghệ thuật', 'Mơ mộng', 'Trực giác tâm linh'],
      loveMatch: ['Cự Giải', 'Bọ Cạp', 'Kim Ngưu'],
      forecast2026: 'Năng lượng tâm linh và nghệ thuật nở rộ. Bạn tìm thấy sự an lạc nội tâm sâu sắc và cảm hứng sáng tác vô tận.'
    }
  ];

  const calculateZodiacFromDate = (d: string) => {
    const date = new Date(d);
    const day = date.getDate();
    const month = date.getMonth() + 1;

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacList[0];
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacList[1];
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacList[2];
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacList[3];
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacList[4];
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacList[5];
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacList[6];
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacList[7];
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return zodiacList[8];
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacList[9];
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacList[10];
    return zodiacList[11];
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const z = calculateZodiacFromDate(birthDate);
    setSelectedZodiac(z);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Form tra cứu nhanh */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-purple-500/30 text-center max-w-xl mx-auto space-y-4">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 inline-flex items-center gap-1.5">
          <Moon className="w-4 h-4 text-cyan-400" /> Tra Cứu Cung Hoàng Đạo & Chiêm Tinh Học
        </span>
        <h2 className="text-2xl font-bold font-cinzel text-white">
          Khám Phá Bản Đồ Sao & Cung Mệnh
        </h2>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          Chọn ngày sinh để xác định chòm sao chiếu mệnh, nguyên tố chủ đạo và dự báo thời vận 2026.
        </p>

        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="date"
            required
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm hover:brightness-110 shadow-[0_0_15px_rgba(147,51,234,0.3)] transition cursor-pointer"
          >
            Giải Mã Cung Mệnh
          </button>
        </form>
      </div>

      {/* Kết quả tra cứu chi tiết */}
      {selectedZodiac && (
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-purple-500/40 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 p-0.5 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                <div className="w-full h-full bg-[#0a0720] rounded-3xl flex items-center justify-center text-4xl">
                  {selectedZodiac.symbol}
                </div>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-purple-400 font-bold block">
                  {selectedZodiac.latin} ({selectedZodiac.dates})
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-cinzel text-white">
                  Cung {selectedZodiac.name}
                </h3>
                <span className="text-xs text-amber-300">
                  Nguyên tố: {selectedZodiac.element} • Hành tinh chủ quản: {selectedZodiac.rulingPlanet}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Nguyên tố {selectedZodiac.element}
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {selectedZodiac.rulingPlanet}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase text-purple-300">Đặc Điểm Tính Cách</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedZodiac.traits.map((t, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg text-xs bg-purple-500/20 text-purple-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase text-pink-300 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-pink-400 fill-current" /> Cung Hợp Tình Duyên
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedZodiac.loveMatch.map((m, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg text-xs bg-pink-500/20 text-pink-300 font-semibold">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase text-amber-300 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Vận Số Năm 2026
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedZodiac.forecast2026}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Danh bạ 12 Cung Hoàng Đạo */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold font-cinzel text-slate-100 text-center">
          Khám Phá 12 Cung Hoàng Đạo
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {zodiacList.map(z => (
            <div
              key={z.name}
              onClick={() => setSelectedZodiac(z)}
              className="p-4 rounded-2xl glass-card hover:border-purple-400/60 transition cursor-pointer flex items-center gap-3"
            >
              <span className="text-2xl">{z.symbol}</span>
              <div>
                <h4 className="text-xs font-bold text-slate-100">{z.name}</h4>
                <span className="text-[10px] text-slate-400">{z.dates}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
