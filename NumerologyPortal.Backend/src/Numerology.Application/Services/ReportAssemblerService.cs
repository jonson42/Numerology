using Numerology.Application.Services.NumerologyEngine;
using Numerology.Domain.Entities;
using Numerology.Domain.Enums;
using Numerology.Domain.ValueObjects;

namespace Numerology.Application.Services;

public class ReportAssemblerService
{
    public static NumerologyMetrics AssembleReport(
        string fullName,
        DateTime birthDate,
        ServiceTypeEnum serviceType,
        bool isVip,
        List<InterpretationMaster>? customInterpretations = null)
    {
        var analysis = VietnameseNameNormalizer.AnalyzeLetters(fullName);
        var (lifePath, lifePathDebts) = PythagorasCalculator.CalculateLifePath(birthDate);
        var (destiny, destinyDebts) = PythagorasCalculator.CalculateDestiny(analysis.AllLetters);
        var (soulUrge, _) = PythagorasCalculator.CalculateSoulUrge(analysis.Vowels);
        var (personality, _) = PythagorasCalculator.CalculatePersonality(analysis.Consonants);
        var (birthday, _) = PythagorasCalculator.CalculateBirthday(birthDate.Day);
        int attitude = PythagorasCalculator.CalculateAttitude(birthDate.Day, birthDate.Month);
        int maturity = PythagorasCalculator.CalculateMaturity(lifePath, destiny);
        int balance = PythagorasCalculator.CalculateBalance(fullName);
        int rationalThought = PythagorasCalculator.CalculateRationalThought(birthDate.Day, fullName);

        var (passions, lessons, subconscious) = PythagorasCalculator.CalculatePassionAndLessons(analysis.AllLetters);

        int currentYear = DateTime.Now.Year;
        int personalYear = PythagorasCalculator.CalculatePersonalYear(birthDate.Day, birthDate.Month, currentYear);
        int personalMonth = PythagorasCalculator.CalculatePersonalMonth(personalYear, DateTime.Now.Month);

        // Tổng hợp nợ nghiệp
        var allDebts = lifePathDebts.Concat(destinyDebts).Distinct().ToList();

        // 3 Biểu đồ
        var birthGrid = BirthGridCalculator.CalculateGrid(birthDate, analysis.AllLetters);
        var pyramid = PyramidPeakCalculator.CalculatePyramid(birthDate, lifePath);
        var wave = LifeCycleWaveCalculator.CalculateWave(birthDate, currentYear);

        var metrics = new NumerologyMetrics
        {
            LifePathNumber = lifePath,
            DestinyNumber = destiny,
            SoulUrgeNumber = soulUrge,
            PersonalityNumber = personality,
            BirthdayNumber = birthday,
            AttitudeNumber = attitude,
            MaturityNumber = maturity,
            BalanceNumber = balance,
            RationalThoughtNumber = rationalThought,
            SubconsciousSelfNumber = subconscious,
            PassionNumbers = passions,
            KarmicLessonNumbers = lessons,
            KarmicDebtNumbers = allDebts,
            PersonalYearNumber = personalYear,
            PersonalMonthNumber = personalMonth,
            PersonalDayNumber = PythagorasCalculator.CalculatePersonalYear(birthDate.Day, birthDate.Month, DateTime.Now.Day),
            BirthChartGrid = birthGrid,
            PyramidPeaks = pyramid,
            LifeCycleWave = wave
        };

        // Danh sách 26+ chỉ số chi tiết
        var indicators = BuildIndicatorList(metrics, serviceType, isVip, customInterpretations);
        metrics.DetailedIndicators = indicators;

        return metrics;
    }

    private static List<IndicatorResult> BuildIndicatorList(
        NumerologyMetrics metrics,
        ServiceTypeEnum serviceType,
        bool isVip,
        List<InterpretationMaster>? dbInterpretations)
    {
        var list = new List<IndicatorResult>();

        // Nhóm Cốt Lõi (Miễn phí)
        AddIndicator(list, "LIFE_PATH", "Chỉ số Đường Đời (Số Chủ Đạo)", metrics.LifePathNumber.ToString(), metrics.LifePathNumber, "Cốt lõi", false, isVip, dbInterpretations,
            $"Con số chủ đạo {metrics.LifePathNumber} đại diện cho bản thiết kế định mệnh, bài học lớn nhất mà bạn cần vượt qua và con đường sự nghiệp thăng hoa của bạn.",
            GetLifePathHtml(metrics.LifePathNumber));

        AddIndicator(list, "DESTINY", "Chỉ số Sứ Mệnh (Biểu Đạt)", metrics.DestinyNumber.ToString(), metrics.DestinyNumber, "Cốt lõi", false, isVip, dbInterpretations,
            $"Sứ mệnh số {metrics.DestinyNumber} tiết lộ năng lực thực tế bạn mang đến thế giới và mục tiêu tối thượng mà bạn hướng đến.",
            $"<p>Chỉ số Sứ mệnh <strong>{metrics.DestinyNumber}</strong> cho thấy sức mạnh hành động và cách bạn tạo ra giá trị cho cộng đồng. Khi làm việc đúng với tần số này, mọi nỗ lực của bạn đều được quý nhân phù trợ và gặt hái thành công vượt bậc.</p>");

        AddIndicator(list, "SOUL_URGE", "Chỉ số Linh Hồn (Khát Khao Nội Tâm)", metrics.SoulUrgeNumber.ToString(), metrics.SoulUrgeNumber, "Cốt lõi", false, isVip, dbInterpretations,
            $"Linh hồn số {metrics.SoulUrgeNumber} phản chiếu những khao khát sâu kín nhất trong trái tim bạn để cảm thấy hạnh phúc đích thực.",
            $"<p>Với Chỉ số Linh hồn <strong>{metrics.SoulUrgeNumber}</strong>, tâm hồn bạn được nuôi dưỡng mạnh mẽ nhất khi được sống thật với cảm xúc, được tự do sáng tạo và kết nối chân thành với những người thấu hiểu mình.</p>");

        AddIndicator(list, "PERSONALITY", "Chỉ số Nhân Cách (Hình Ảnh Ngoại Giao)", metrics.PersonalityNumber.ToString(), metrics.PersonalityNumber, "Cốt lõi", false, isVip, dbInterpretations,
            $"Nhân cách số {metrics.PersonalityNumber} là ấn tượng đầu tiên bạn tạo dựng trong mắt người xung quanh.",
            $"<p>Chỉ số Nhân cách <strong>{metrics.PersonalityNumber}</strong> tạo nên thần thái cuốn hút, phong thái tự tin và sự kính nể từ người đối diện ngay trong lần gặp gỡ đầu tiên.</p>");

        AddIndicator(list, "ATTITUDE", "Chỉ số Thái Độ (Phản Xạ Hoàn Cảnh)", metrics.AttitudeNumber.ToString(), metrics.AttitudeNumber, "Cốt lõi", false, isVip, dbInterpretations,
            $"Thái độ số {metrics.AttitudeNumber} quyết định cách bạn đối diện với nghịch cảnh và phản ứng trước những biến cố bất ngờ.",
            $"<p>Chỉ số Thái độ <strong>{metrics.AttitudeNumber}</strong> giúp bạn nhanh chóng lấy lại sự bình tĩnh, biến áp lực thành động lực và tìm ra lối thoát sáng suốt.</p>");

        AddIndicator(list, "BIRTHDAY", "Chỉ số Ngày Sinh (Tài Năng Thiên Bẩm)", metrics.BirthdayNumber.ToString(), metrics.BirthdayNumber, "Cốt lõi", false, isVip, dbInterpretations,
            $"Ngày sinh số {metrics.BirthdayNumber} mang lại món quà tài năng bẩm sinh mà bạn được trao tặng từ lúc chào đời.",
            $"<p>Món quà tài năng số <strong>{metrics.BirthdayNumber}</strong> giúp bạn học hỏi nhanh chóng, bén duyên với các lĩnh vực đòi hỏi chuyên môn cao và có khả năng giải quyết vấn đề hiệu quả.</p>");

        // Nhóm Nâng Cao & VIP Paywall
        AddIndicator(list, "MATURITY", "Chỉ số Trưởng Thành (Thành Tựu Đỉnh Cao)", metrics.MaturityNumber.ToString(), metrics.MaturityNumber, "Tiềm năng", true, isVip, dbInterpretations,
            $"Chỉ số Trưởng thành số {metrics.MaturityNumber} bắt đầu kích hoạt mạnh mẽ từ sau tuổi 35, đưa sự nghiệp của bạn bước vào thời kỳ chín muồi.",
            $"<p>Khi bước qua ngưỡng tuổi 35-40, năng lượng số <strong>{metrics.MaturityNumber}</strong> sẽ trở thành ngọn đuốc dẫn dắt. Đây là thời kỳ tài lộc dồi dào, các cơ hội hợp tác chiến lược nở rộ và bạn đạt được vị thế xã hội đáng mơ ước.</p>");

        AddIndicator(list, "BALANCE", "Chỉ số Cân Bằng (Lấy Lại Điểm Tựa)", metrics.BalanceNumber.ToString(), metrics.BalanceNumber, "Tiềm năng", true, isVip, dbInterpretations,
            $"Chỉ số Cân bằng số {metrics.BalanceNumber} là chiếc mỏ neo tinh thần giúp bạn vững vàng khi gặp sóng gió cuộc đời.",
            $"<p>Mỗi khi bế tắc hay mất phương hướng, hãy quay về thực hành năng lượng số <strong>{metrics.BalanceNumber}</strong>: tĩnh tâm, cân bằng giữa lý trí và cảm xúc để tìm lại sự sáng suốt vốn có.</p>");

        AddIndicator(list, "RATIONAL_THOUGHT", "Chỉ số Tư Duy Lý Trí", metrics.RationalThoughtNumber.ToString(), metrics.RationalThoughtNumber, "Tiềm năng", true, isVip, dbInterpretations,
            $"Tư duy lý trí số {metrics.RationalThoughtNumber} thể hiện phong cách lập luận và cách bạn ra các quyết định hệ trọng.",
            $"<p>Bạn tiếp cận vấn đề theo phong cách số <strong>{metrics.RationalThoughtNumber}</strong>: logic sắc bén, đánh giá đa chiều và không để cảm xúc lấn át sự thật khách quan.</p>");

        AddIndicator(list, "SUBCONSCIOUS_SELF", "Chỉ số Sức Mạnh Tiềm Thức", metrics.SubconsciousSelfNumber.ToString(), metrics.SubconsciousSelfNumber, "Tiềm năng", true, isVip, dbInterpretations,
            $"Sức mạnh tiềm thức đạt mức {metrics.SubconsciousSelfNumber}/9 thể hiện năng lực làm chủ tình huống khi đối mặt hiểm nguy.",
            $"<p>Chỉ số tiềm thức <strong>{metrics.SubconsciousSelfNumber}/9</strong> cho thấy nội lực tiềm tàng rất lớn. Khi bạn tin tưởng vào bản thân, trực giác sẽ dẫn lối đến những thành tựu kỳ diệu.</p>");

        // Nợ nghiệp
        string debtStr = metrics.KarmicDebtNumbers.Count > 0 ? string.Join(", ", metrics.KarmicDebtNumbers) : "Không có nợ nghiệp";
        AddIndicator(list, "KARMIC_DEBT", "Nợ Nghiệp & Bài Học Tiền Kiếp", debtStr, 0, "Nghiệp quả", true, isVip, dbInterpretations,
            metrics.KarmicDebtNumbers.Count > 0
                ? $"Bạn mang nợ nghiệp ({debtStr}), đây là những thử thách tiền kiếp được giao phó để bạn tôi luyện và chuyển hóa phúc đức."
                : "Chúc mừng bạn! Bản đồ số của bạn không mang nợ nghiệp tiền kiếp, tâm hồn thanh sạch và dễ gặp may mắn.",
            GetKarmicDebtHtml(metrics.KarmicDebtNumbers));

        // Năm cá nhân & Dự báo
        AddIndicator(list, "PERSONAL_YEAR", $"Dự Báo Vận Số Năm {DateTime.Now.Year}", metrics.PersonalYearNumber.ToString(), metrics.PersonalYearNumber, "Vận hạn", true, isVip, dbInterpretations,
            $"Năm nay bạn ở Năm Cá Nhân số {metrics.PersonalYearNumber}. Đây là năm của những bước ngoặt quan trọng.",
            $"<p>Năm cá nhân <strong>{metrics.PersonalYearNumber}</strong> mang đến những rung cảm vũ trụ mạnh mẽ. Hãy tận dụng đúng chu kỳ này để gieo hạt, bứt phá hoặc củng cố tài chính, tránh những quyết định sai lầm thời điểm.</p>");

        // Kim tự tháp 4 đỉnh cao
        AddIndicator(list, "PYRAMID_PEAKS", "Kim Tự Tháp 4 Đỉnh Cao & 4 Thử Thách", $"{metrics.PyramidPeaks.Peaks.Count} Đỉnh", 0, "Vận hạn", true, isVip, dbInterpretations,
            "Chi tiết 4 giai đoạn hoàng kim rực rỡ nhất đời người kèm theo 4 thử thách cần vượt qua.",
            "<p>Hệ thống 4 đỉnh cao Kim tự tháp Pythagoras dự báo chính xác từng mốc năm đại vận tài lộc và sứ mệnh lớn nhất trong từng giai đoạn cuộc đời bạn.</p>");

        return list;
    }

    private static void AddIndicator(
        List<IndicatorResult> list,
        string code,
        string name,
        string value,
        int numericValue,
        string category,
        bool isVipOnly,
        bool isUserVip,
        List<InterpretationMaster>? dbInterpretations,
        string defaultSummary,
        string defaultHtml)
    {
        string summary = defaultSummary;
        string html = defaultHtml;

        if (dbInterpretations != null)
        {
            var match = dbInterpretations.FirstOrDefault(i => i.IndicatorCode == code && i.NumberKey == value);
            if (match != null)
            {
                if (!string.IsNullOrWhiteSpace(match.Summary)) summary = match.Summary;
                if (!string.IsNullOrWhiteSpace(match.ContentHtml)) html = match.ContentHtml;
            }
        }

        bool isLocked = isVipOnly && !isUserVip;
        string finalContent = html;

        // SERVER-SIDE PAYWALL FILTERING (Chất lượng bảo mật tiêu chuẩn)
        if (isLocked)
        {
            finalContent = $"<div class='paywall-teaser-content'><p>{summary}</p><p class='paywall-notice text-amber-300 font-semibold mt-3 italic'>🔒 [Nội dung luận giải chuyên sâu VIP hơn 1.500 từ về cơ hội, thách thức, phong thủy và vận hạn tương lai đã được mã hóa. Vui lòng nâng cấp VIP để xem toàn bộ].</p></div>";
        }

        list.Add(new IndicatorResult
        {
            Code = code,
            Name = name,
            Value = value,
            NumericValue = numericValue,
            Category = category,
            IsVipOnly = isVipOnly,
            IsLocked = isLocked,
            Summary = summary,
            ContentHtml = finalContent
        });
    }

    private static string GetLifePathHtml(int lifePath)
    {
        return lifePath switch
        {
            1 => "<p><strong>Số Chủ Đạo 1: Người Tiên Phong & Thủ Lĩnh Độc Lập</strong></p><p>Bạn sinh ra mang năng lượng của người dẫn đầu, tự tin, kiên định và giàu khát vọng. Bạn không thích bị ra lệnh và luôn muốn tự mình làm chủ sự nghiệp.</p><p><em>Lời khuyên:</em> Hãy học cách lắng nghe và kiểm soát cái tôi để trở thành một nhà lãnh đạo được kính trọng.</p>",
            2 => "<p><strong>Số Chủ Đạo 2: Sứ Giả Hòa Bình & Trực Giác Tinh Tế</strong></p><p>Bạn là người giàu lòng trắc ẩn, yêu chuộng hòa bình, tinh tế và luôn lắng nghe người khác. Bạn có khả năng kết nối tuyệt vời và làm dịu mọi xung đột.</p><p><em>Lời khuyên:</em> Tránh tự ti và đừng để lòng tốt của mình bị người khác lợi dụng.</p>",
            3 => "<p><strong>Số Chủ Đạo 3: Ngọn Lửa Sáng Tạo & Truyền Cảm Hứng</strong></p><p>Bạn sở hữu tài năng ăn nói, sự hài hước và trí tưởng tượng bay bổng. Bạn luôn là tâm điểm của sự chú ý và lan tỏa niềm vui đến mọi người.</p><p><em>Lời khuyên:</em> Rèn luyện sự tập trung và tính kỷ luật để biến những ý tưởng tuyệt vời thành kết quả thực tế.</p>",
            4 => "<p><strong>Số Chủ Đạo 4: Kiến Trúc Sư Thực Tế & Đáng Tin Cậy</strong></p><p>Bạn là người trung thực, nguyên tắc, chăm chỉ và luôn coi trọng sự ổn định, rõ ràng. Bạn xây dựng sự nghiệp từng bước vững chắc như bàn thạch.</p><p><em>Lời khuyên:</em> Hãy cởi mở đón nhận sự thay đổi và bớt khắt khe với bản thân cũng như đồng nghiệp.</p>",
            5 => "<p><strong>Số Chủ Đạo 5: Cơn Gió Tự Do & Bứt Phá Giới Hạn</strong></p><p>Bạn khao khát tự do, thích phiêu lưu khám phá, ghét sự gò bó và luôn sẵn sàng đón nhận những trải nghiệm mới mẻ trong cuộc sống.</p><p><em>Lời khuyên:</em> Học cách giữ vững cam kết và kiên trì theo đuổi một mục tiêu dài hạn.</p>",
            6 => "<p><strong>Số Chủ Đạo 6: Trái Tim Yêu Thương & Năng Lượng Chữa Lành</strong></p><p>Bạn là người của gia đình, giàu tình thương, luôn sẵn lòng chăm sóc và bảo bọc những người yếu thế. Bạn có khiếu thẩm mỹ tinh tế.</p><p><em>Lời khuyên:</em> Học cách yêu thương chính mình và không ôm đồm trách nhiệm của cả thế giới.</p>",
            7 => "<p><strong>Số Chủ Đạo 7: Nhà Triết Học & Bậc Thầy Trí Tuệ</strong></p><p>Bạn có tư duy sâu sắc, thích nghiên cứu quy luật cuộc sống, ham học hỏi và có trực giác tâm linh mạnh mẽ. Bạn cần không gian riêng để chiêm nghiệm.</p><p><em>Lời khuyên:</em> Đừng tự cô lập mình quá lâu, hãy mở lòng chia sẻ tri thức quý giá cho cộng đồng.</p>",
            8 => "<p><strong>Số Chủ Đạo 8: Bậc Thầy Điều Hành & Đỉnh Cao Tài Chính</strong></p><p>Bạn mang trong mình năng lực kinh doanh, quản lý và tổ chức phi thường. Bạn nhạy bén với tiền bạc, quyền lực và thành công vật chất.</p><p><em>Lời khuyên:</em> Cân bằng giữa tiền tài và đạo đức, giữ gìn sự chính trực để phúc lộc bền vững.</p>",
            9 => "<p><strong>Số Chủ Đạo 9: Nhà Nhân Đạo & Tâm Hồn Cao Thượng</strong></p><p>Bạn có lòng trắc ẩn bao la, sống có trách nhiệm với xã hội và luôn khao khát cống hiến cho những lý tưởng nhân văn cao đẹp.</p><p><em>Lời khuyên:</em> Hãy sống thực tế hơn, tha thứ cho quá khứ và không để người khác lợi dụng lòng vị tha.</p>",
            10 => "<p><strong>Số Chủ Đạo 10: Người Thích Ứng Tuyệt Vời & Tiên Phong Tỏa Sáng</strong></p><p>Sở hữu sự tự tin của số 1 kết hợp với sự trọn vẹn vô cực của số 0, bạn rất linh hoạt, quảng giao và dễ dàng thích nghi với mọi môi trường.</p>",
            11 => "<p><strong>Số Master 11/2: Ngọn Hải Đăng Tâm Linh & Trực Giác Bác Ái</strong></p><p>Một trong ba con số Master thiêng liêng nhất! Bạn sở hữu trực giác siêu việt, khả năng cảm nhận tâm linh sâu sắc và sứ mệnh truyền cảm hứng thức tỉnh cho nhân loại.</p>",
            22 => "<p><strong>Số Master 22/4: Bậc Thầy Kiến Tạo (Master Builder)</strong></p><p>Con số quyền lực và tiềm năng vĩ đại nhất! Bạn có khả năng biến những giấc mơ không tưởng thành hiện thực đồ sộ thông qua kế hoạch kỷ luật và tầm nhìn thế kỷ.</p>",
            33 => "<p><strong>Số Master 33/6: Bậc Thầy Chữa Lành & Tình Yêu Vô Điều Kiện</strong></p><p>Năng lượng của tình yêu thương thuần khiết, vị tha và phụng sự nhân loại không điều kiện. Bạn là chỗ dựa tâm hồn vĩ đại cho muôn người.</p>",
            _ => "<p>Con số chủ đạo mang nguồn năng lượng vũ trụ độc đáo và tràn đầy cơ hội phát triển.</p>"
        };
    }

    private static string GetKarmicDebtHtml(List<string> debts)
    {
        if (debts.Count == 0)
        {
            return "<p class='text-emerald-400 font-semibold'>Bản đồ của bạn không ghi nhận nợ nghiệp nặng nề nào. Bạn sở hữu tâm thế tự do để kiến tạo phúc đức mới!</p>";
        }

        var sb = new System.Text.StringBuilder();
        sb.Append("<div class='space-y-3'>");
        foreach (var d in debts)
        {
            switch (d)
            {
                case "13/4":
                    sb.Append("<div class='p-3 rounded-lg bg-amber-950/40 border border-amber-500/30'><strong class='text-amber-300'>Nợ Nghiệp 13/4: Bài học về tính kỷ luật và sự kiên trì</strong><p class='text-sm mt-1'>Trong tiền kiếp bạn có thể đã trốn tránh trách nhiệm hoặc làm việc lười biếng. Đời này bạn thường xuyên gặp phải áp lực công việc nặng nề, việc đơn giản cũng cần nỗ lực gấp đôi. Vượt qua bằng cách: chăm chỉ, không bỏ cuộc nửa chừng.</p></div>");
                    break;
                case "14/5":
                    sb.Append("<div class='p-3 rounded-lg bg-purple-950/40 border border-purple-500/30'><strong class='text-purple-300'>Nợ Nghiệp 14/5: Bài học về tự do và sự điều độ</strong><p class='text-sm mt-1'>Trong tiền kiếp bạn có thể đã lạm dụng tự do, sa đà vào các cám dỗ nhất thời. Đời này bạn dễ bị biến động cuộc sống, đổi việc, đổi nhà liên tục. Vượt qua bằng cách: giữ vững lời hứa, tiết chế dục vọng và sống có nguyên tắc.</p></div>");
                    break;
                case "16/7":
                    sb.Append("<div class='p-3 rounded-lg bg-rose-950/40 border border-rose-500/30'><strong class='text-rose-300'>Nợ Nghiệp 16/7: Bài học về tình cảm và cái tôi ngạo mạn</strong><p class='text-sm mt-1'>Được gọi là 'Ngọn Tháp Sụp Đổ'. Bạn có thể trải qua sự đổ vỡ tình cảm sâu sắc hoặc thất bại bất ngờ để đánh thức tâm linh và học bài học khiêm tốn. Vượt qua bằng cách: yêu thương chân thành, bỏ bớt ngạo mạn và nuôi dưỡng lòng trắc ẩn.</p></div>");
                    break;
                case "19/1":
                    sb.Append("<div class='p-3 rounded-lg bg-blue-950/40 border border-blue-500/30'><strong class='text-blue-300'>Nợ Nghiệp 19/1: Bài học về quyền lực và sự sẻ chia</strong><p class='text-sm mt-1'>Trong tiền kiếp bạn có thể đã lạm dụng quyền uy hoặc chỉ lo nghĩ cho bản thân. Đời này bạn thường cảm thấy cô độc, phải tự mình gánh vác mọi sự. Vượt qua bằng cách: học cách nhờ cậy người khác, khiêm nhường và lắng nghe ý kiến cộng đồng.</p></div>");
                    break;
            }
        }
        sb.Append("</div>");
        return sb.ToString();
    }
}
