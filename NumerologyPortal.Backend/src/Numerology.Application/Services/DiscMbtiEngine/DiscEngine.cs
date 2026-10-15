namespace Numerology.Application.Services.DiscMbtiEngine;

public class DiscQuestion
{
    public int Id { get; set; }
    public string Scenario { get; set; } = string.Empty;
    public List<DiscOption> Options { get; set; } = new();
}

public class DiscOption
{
    public string Trait { get; set; } = string.Empty; // "D", "I", "S", "C"
    public string Text { get; set; } = string.Empty;
}

public class DiscResultDto
{
    public int ScoreD { get; set; }
    public int ScoreI { get; set; }
    public int ScoreS { get; set; }
    public int ScoreC { get; set; }

    public int PercentD { get; set; }
    public int PercentI { get; set; }
    public int PercentS { get; set; }
    public int PercentC { get; set; }

    public string PrimaryType { get; set; } = string.Empty; // "D", "I", "S", "C" hoặc "DI", "SC"...
    public string Title { get; set; } = string.Empty;
    public string Overview { get; set; } = string.Empty;
    public List<string> Strengths { get; set; } = new();
    public List<string> Weaknesses { get; set; } = new();
    public List<string> SuitableCareers { get; set; } = new();
    public string CommunicationAdvice { get; set; } = string.Empty;
}

public static class DiscEngine
{
    public static List<DiscQuestion> GetQuestions()
    {
        return new List<DiscQuestion>
        {
            new()
            {
                Id = 1,
                Scenario = "Khi đứng trước một thử thách hoặc nhiệm vụ mới đầy khó khăn:",
                Options = new()
                {
                    new() { Trait = "D", Text = "Tôi lập tức xông pha chỉ huy, quyết tâm đạt mục tiêu bằng mọi giá." },
                    new() { Trait = "I", Text = "Tôi truyền cảm hứng, rủ rê đồng nghiệp cùng tham gia cho sôi nổi." },
                    new() { Trait = "S", Text = "Tôi bình tĩnh lắng nghe, sẵn sàng hỗ trợ đồng đội hoàn thành chu đáo." },
                    new() { Trait = "C", Text = "Tôi phân tích dữ liệu, tìm kiếm quy trình chuẩn xác trước khi bắt tay làm." }
                }
            },
            new()
            {
                Id = 2,
                Scenario = "Trong một cuộc họp thảo luận nhóm:",
                Options = new()
                {
                    new() { Trait = "D", Text = "Thẳng thắn đi thẳng vào vấn đề, không thích nói vòng vo mất thời gian." },
                    new() { Trait = "I", Text = "Sôi nổi phát biểu ý tưởng mới, tạo bầu không khí hài hước, vui vẻ." },
                    new() { Trait = "S", Text = "Kiên nhẫn lắng nghe mọi người, tạo sự hòa hợp và tránh xung đột." },
                    new() { Trait = "C", Text = "Đưa ra bằng chứng, số liệu cụ thể và chỉ ra những điểm chưa hợp lý." }
                }
            },
            new()
            {
                Id = 3,
                Scenario = "Khi đồng nghiệp hoặc người khác gặp sai lầm:",
                Options = new()
                {
                    new() { Trait = "D", Text = "Yêu cầu sửa chữa ngay lập tức và quy trách nhiệm rõ ràng." },
                    new() { Trait = "I", Text = "An ủi, động viên tinh thần để họ không nản chí." },
                    new() { Trait = "S", Text = "Ân cần hỗ trợ họ cùng khắc phục hậu quả một cách từ tốn." },
                    new() { Trait = "C", Text = "Rà soát lại quy trình để tìm ra nguyên nhân gốc rễ tránh tái diễn." }
                }
            },
            new()
            {
                Id = 4,
                Scenario = "Môi trường làm việc lý tưởng nhất với bạn là:",
                Options = new()
                {
                    new() { Trait = "D", Text = "Môi trường cạnh tranh cao, có quyền tự chủ và thăng tiến nhanh." },
                    new() { Trait = "I", Text = "Môi trường sáng tạo, cởi mở, có cơ hội giao tiếp và kết nối rộng rãi." },
                    new() { Trait = "S", Text = "Môi trường ổn định, hòa thuận, mọi người đối xử chân thành với nhau." },
                    new() { Trait = "C", Text = "Môi trường chuyên nghiệp, có quy chuẩn rõ ràng, tôn trọng sự chính xác." }
                }
            },
            new()
            {
                Id = 5,
                Scenario = "Khi đối diện với sự thay đổi đột ngột ngoài kế hoạch:",
                Options = new()
                {
                    new() { Trait = "D", Text = "Nhanh chóng thích ứng và nắm quyền kiểm soát tình hình mới." },
                    new() { Trait = "I", Text = "Cảm thấy hào hứng vì sắp có những điều mới mẻ thú vị." },
                    new() { Trait = "S", Text = "Cần thời gian làm quen và thích nghi, thích sự ổn định hơn." },
                    new() { Trait = "C", Text = "Đánh giá lại rủi ro và các kịch bản dự phòng chi tiết." }
                }
            },
            new()
            {
                Id = 6,
                Scenario = "Điều gì khiến bạn cảm thấy bực bội nhất:",
                Options = new()
                {
                    new() { Trait = "D", Text = "Sự chậm chạp, lề mề và không chịu hành động." },
                    new() { Trait = "I", Text = "Bị cô lập, bị phớt lờ hoặc môi trường gò bó cứng nhắc." },
                    new() { Trait = "S", Text = "Sự bất hòa, cãi vã và thiếu tôn trọng lẫn nhau." },
                    new() { Trait = "C", Text = "Làm việc cẩu thả, thiếu chính xác và không có căn cứ." }
                }
            },
            new()
            {
                Id = 7,
                Scenario = "Phong cách ra quyết định mua sắm của bạn:",
                Options = new()
                {
                    new() { Trait = "D", Text = "Quyết định rất nhanh khi thấy đúng mục đích và hiệu quả." },
                    new() { Trait = "I", Text = "Thường mua theo cảm xúc, mẫu mã bắt mắt hoặc do người khác khen ngợi." },
                    new() { Trait = "S", Text = "Ưu tiên thương hiệu quen thuộc đã tin dùng lâu năm." },
                    new() { Trait = "C", Text = "So sánh kỹ thông số kỹ thuật, đánh giá review chi tiết trước khi mua." }
                }
            },
            new()
            {
                Id = 8,
                Scenario = "Khi hoàn thành một dự án lớn, bạn cảm thấy tự hào nhất về:",
                Options = new()
                {
                    new() { Trait = "D", Text = "Chiến thắng mục tiêu vượt trội và vượt lên dẫn đầu." },
                    new() { Trait = "I", Text = "Sự công nhận, tán thưởng và niềm vui chia sẻ cùng mọi người." },
                    new() { Trait = "S", Text = "Sự gắn kết đồng đội và sự tin cậy lâu dài đã xây dựng được." },
                    new() { Trait = "C", Text = "Chất lượng hoàn hảo, chuẩn mực cao và không tì vết." }
                }
            }
        };
    }

    public static DiscResultDto Calculate(List<string> selectedTraits)
    {
        int countD = selectedTraits.Count(t => t == "D");
        int countI = selectedTraits.Count(t => t == "I");
        int countS = selectedTraits.Count(t => t == "S");
        int countC = selectedTraits.Count(t => t == "C");

        int total = Math.Max(1, countD + countI + countS + countC);
        int percentD = (int)Math.Round((double)countD / total * 100);
        int percentI = (int)Math.Round((double)countI / total * 100);
        int percentS = (int)Math.Round((double)countS / total * 100);
        int percentC = 100 - (percentD + percentI + percentS);

        var scores = new List<(string Trait, int Score)>
        {
            ("D", countD),
            ("I", countI),
            ("S", countS),
            ("C", countC)
        }.OrderByDescending(x => x.Score).ToList();

        string primary = scores[0].Trait;

        var result = new DiscResultDto
        {
            ScoreD = countD,
            ScoreI = countI,
            ScoreS = countS,
            ScoreC = countC,
            PercentD = percentD,
            PercentI = percentI,
            PercentS = percentS,
            PercentC = percentC,
            PrimaryType = primary
        };

        switch (primary)
        {
            case "D":
                result.Title = "Nhóm D: Người Thống Trị (Dominance)";
                result.Overview = "Bạn là người quyết đoán, mạnh mẽ, tiên phong và luôn hướng tới kết quả. Bạn không ngại đương đầu với thử thách cam go và thích nắm giữ quyền kiểm soát tình hình.";
                result.Strengths = new() { "Khả năng lãnh đạo bẩm sinh", "Tập trung cao độ vào mục tiêu", "Ra quyết định nhanh chóng, dứt khoát", "Không sợ rủi ro hay áp lực lớn" };
                result.Weaknesses = new() { "Đôi khi thiếu kiên nhẫn với người khác", "Dễ bị coi là độc đoán, áp đặt", "Có xu hướng phớt lờ chi tiết nhỏ" };
                result.SuitableCareers = new() { "Giám đốc điều hành (CEO)", "Chủ doanh nghiệp khởi nghiệp", "Quản lý dự án chiến lược", "Luật sư tranh tụng" };
                result.CommunicationAdvice = "Nên lắng nghe ý kiến người khác nhiều hơn, hạ bớt cái tôi và thể hiện sự đồng cảm với đồng nghiệp.";
                break;
            case "I":
                result.Title = "Nhóm I: Người Ảnh Hưởng (Influence)";
                result.Overview = "Bạn là người nhiệt huyết, cởi mở, tràn đầy năng lượng tích cực và có sức hút tự nhiên. Bạn truyền cảm hứng mạnh mẽ đến mọi người xung quanh và thích xây dựng các mối quan hệ rộng lớn.";
                result.Strengths = new() { "Khả năng giao tiếp và thuyết phục xuất sắc", "Sáng tạo và dồi dào ý tưởng mới", "Tạo dựng mạng lưới quan hệ xã hội tuyệt vời", "Luôn lạc quan và lan tỏa năng lượng tích cực" };
                result.Weaknesses = new() { "Dễ bị phân tâm, thiếu tập trung lâu dài", "Kém trong việc bám sát kế hoạch chi tiết", "Đôi khi quá bốc đồng trong quyết định" };
                result.SuitableCareers = new() { "Giám đốc Marketing / PR", "Chuyên gia truyền thông, diễn giả", "Nghệ thuật, thiết kế sáng tạo", "Quản lý kinh doanh (Sales Director)" };
                result.CommunicationAdvice = "Rèn luyện tính kỷ luật, ghi chép cẩn thận và học cách nói ít lại để lắng nghe sâu hơn.";
                break;
            case "S":
                result.Title = "Nhóm S: Người Kiên Định (Steadiness)";
                result.Overview = "Bạn là người kiên nhẫn, điềm tĩnh, trung thành và đáng tin cậy. Bạn luôn đặt sự hòa hợp của tập thể lên hàng đầu, là chỗ dựa tinh thần vững chắc cho bạn bè và đồng nghiệp.";
                result.Strengths = new() { "Lắng nghe chân thành và thấu hiểu sâu sắc", "Trung thành, kiên trì và chịu khó", "Tạo sự ổn định và hòa thuận trong nhóm", "Làm việc có phương pháp và tận tụy" };
                result.Weaknesses = new() { "Ngại thay đổi và sợ xung đột trực diện", "Khó nói lời từ chối người khác (dễ cả nể)", "Dễ giấu kín cảm xúc tiêu cực trong lòng" };
                result.SuitableCareers = new() { "Quản lý nhân sự (HR)", "Chuyên viên chăm sóc khách hàng", "Bác sĩ, điều dưỡng, y tế", "Giáo viên, cố vấn tâm lý" };
                result.CommunicationAdvice = "Dũng cảm bày tỏ quan điểm của mình, học cách từ chối khi cần thiết và chủ động đón nhận sự thay đổi.";
                break;
            case "C":
            default:
                result.Title = "Nhóm C: Người Tuân Thủ (Conscientiousness)";
                result.Overview = "Bạn là người logic, tỉ mỉ, cẩn trọng và yêu cầu độ chính xác cao. Bạn làm việc dựa trên dữ liệu, quy trình chuẩn mực và luôn hướng tới sự hoàn hảo.";
                result.Strengths = new() { "Tư duy phân tích số liệu sắc sảo", "Độ chính xác và ngăn nắp tuyệt đối", "Tuân thủ kỷ luật và cam kết chất lượng", "Khả năng giải quyết vấn đề phức tạp" };
                result.Weaknesses = new() { "Cầu toàn quá mức dẫn đến chậm tiến độ", "Khắt khe với bản thân và người khác", "Dễ rơi vào bẫy 'tê liệt phân tích' (Analysis Paralysis)" };
                result.SuitableCareers = new() { "Kỹ sư phần mềm, kiến trúc sư hệ thống", "Kế toán trưởng, kiểm toán viên", "Nhà phân tích tài chính / Data Analyst", "Nghiên cứu khoa học" };
                result.CommunicationAdvice = "Chấp nhận sự không hoàn hảo trong cuộc sống, linh hoạt hơn và mở lòng chia sẻ cảm xúc cá nhân.";
                break;
        }

        return result;
    }
}
