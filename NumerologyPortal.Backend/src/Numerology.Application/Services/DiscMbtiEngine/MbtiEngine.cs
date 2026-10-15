namespace Numerology.Application.Services.DiscMbtiEngine;

public class MbtiQuestion
{
    public int Id { get; set; }
    public string Dimension { get; set; } = string.Empty; // "EI", "SN", "TF", "JP"
    public string Prompt { get; set; } = string.Empty;
    public string OptionA { get; set; } = string.Empty;
    public string ValueA { get; set; } = string.Empty; // "E", "S", "T", "J"
    public string OptionB { get; set; } = string.Empty;
    public string ValueB { get; set; } = string.Empty; // "I", "N", "F", "P"
}

public class MbtiResultDto
{
    public string Code { get; set; } = string.Empty; // "INTJ"
    public string Title { get; set; } = string.Empty; // "Kiến Trúc Sư Chiến Lược (INTJ)"
    public string Nickname { get; set; } = string.Empty;
    public string Overview { get; set; } = string.Empty;

    public int ScoreE { get; set; }
    public int ScoreI { get; set; }
    public int ScoreS { get; set; }
    public int ScoreN { get; set; }
    public int ScoreT { get; set; }
    public int ScoreF { get; set; }
    public int ScoreJ { get; set; }
    public int ScoreP { get; set; }

    public List<string> Strengths { get; set; } = new();
    public List<string> Weaknesses { get; set; } = new();
    public List<string> SuitableCareers { get; set; } = new();
    public List<string> CompatibleTypes { get; set; } = new();
}

public static class MbtiEngine
{
    public static List<MbtiQuestion> GetQuestions()
    {
        return new List<MbtiQuestion>
        {
            // EI Dimension
            new()
            {
                Id = 1,
                Dimension = "EI",
                Prompt = "Sau một tuần làm việc căng thẳng, bạn nạp lại năng lượng bằng cách:",
                OptionA = "Tham gia các buổi gặp gỡ, tiệc tùng hoặc trò chuyện rôm rả cùng bạn bè.",
                ValueA = "E",
                OptionB = "Ở nhà một mình đọc sách, xem phim hoặc tận hưởng không gian yên tĩnh.",
                ValueB = "I"
            },
            new()
            {
                Id = 2,
                Dimension = "EI",
                Prompt = "Khi tham gia một bữa tiệc có nhiều người lạ:",
                OptionA = "Chủ động bắt chuyện, dễ dàng hòa nhập và làm quen nhiều người mới.",
                ValueA = "E",
                OptionB = "Chờ người khác tiếp cận hoặc chỉ trò chuyện với những người bạn quen biết.",
                ValueB = "I"
            },
            new()
            {
                Id = 3,
                Dimension = "EI",
                Prompt = "Cách bạn suy nghĩ và giải quyết vấn đề:",
                OptionA = "Thích trao đổi trực tiếp, nói ra thành lời để nảy sinh ý tưởng.",
                ValueA = "E",
                OptionB = "Suy ngẫm kỹ trong đầu trước khi chia sẻ ra bên ngoài.",
                ValueB = "I"
            },

            // SN Dimension
            new()
            {
                Id = 4,
                Dimension = "SN",
                Prompt = "Khi tiếp nhận thông tin mới, bạn quan tâm nhiều hơn đến:",
                OptionA = "Thực tế cụ thể, chi tiết hiện tại và những gì mắt thấy tai nghe.",
                ValueA = "S",
                OptionB = "Ý nghĩa sâu xa, bức tranh tổng thể và những tiềm năng tương lai.",
                ValueB = "N"
            },
            new()
            {
                Id = 5,
                Dimension = "SN",
                Prompt = "Bạn tự nhận mình là người:",
                OptionA = "Thực tế, coi trọng kinh nghiệm đã được chứng minh qua thời gian.",
                ValueA = "S",
                OptionB = "Giàu trí tưởng tượng, thích khám phá các lý thuyết và ý tưởng trừu tượng.",
                ValueB = "N"
            },
            new()
            {
                Id = 6,
                Dimension = "SN",
                Prompt = "Khi đọc một cuốn sách hoặc bài viết:",
                OptionA = "Bạn chú ý đến các sự kiện, số liệu và câu chuyện cụ thể.",
                ValueA = "S",
                OptionB = "Bạn tìm kiếm các phép ẩn dụ, triết lý và thông điệp ngầm đằng sau.",
                ValueB = "N"
            },

            // TF Dimension
            new()
            {
                Id = 7,
                Dimension = "TF",
                Prompt = "Khi đưa ra một quyết định quan trọng:",
                OptionA = "Dựa trên tính logic, sự thật khách quan và tính công bằng.",
                ValueA = "T",
                OptionB = "Dựa trên cảm xúc, các giá trị nhân văn và tác động đến con người.",
                ValueB = "F"
            },
            new()
            {
                Id = 8,
                Dimension = "TF",
                Prompt = "Khi bạn bè tìm đến tâm sự về một rắc rối:",
                OptionA = "Bạn nhanh chóng phân tích nguyên nhân và đề xuất giải pháp xử lý.",
                ValueA = "T",
                OptionB = "Bạn lắng nghe, đồng cảm và vỗ về cảm xúc của họ trước tiên.",
                ValueB = "F"
            },
            new()
            {
                Id = 9,
                Dimension = "TF",
                Prompt = "Điều gì khiến bạn đánh giá cao hơn ở một người lãnh đạo:",
                OptionA = "Sự quyết đoán, kiên định với quy tắc và không thiên vị.",
                ValueA = "T",
                OptionB = "Sự ấm áp, thấu cảm và truyền động lực cho cấp dưới.",
                ValueB = "F"
            },

            // JP Dimension
            new()
            {
                Id = 10,
                Dimension = "JP",
                Prompt = "Trước khi đi du lịch hoặc bắt đầu một dự án:",
                OptionA = "Lên lịch trình cụ thể, đặt vé trước và tuân thủ từng mốc thời gian.",
                ValueA = "J",
                OptionB = "Đi đến đâu tính đến đó, thích sự ngẫu hứng và linh hoạt tùy hứng.",
                ValueB = "P"
            },
            new()
            {
                Id = 11,
                Dimension = "JP",
                Prompt = "Cách bạn quản lý không gian sống và bàn làm việc:",
                OptionA = "Ngăn nắp, đồ vật được sắp xếp theo vị trí quy định cố định.",
                ValueA = "J",
                OptionB = "Hơi bừa bộn một chút nhưng bạn vẫn biết tìm đồ ở đâu khi cần.",
                ValueB = "P"
            },
            new()
            {
                Id = 12,
                Dimension = "JP",
                Prompt = "Khi có hạn chót (Deadline) công việc:",
                OptionA = "Hoàn thành sớm từ trước để không phải vội vã lúc cuối.",
                ValueA = "J",
                OptionB = "Thường đợi đến gần hạn chót mới có nguồn cảm hứng và năng lượng làm nhanh.",
                ValueB = "P"
            }
        };
    }

    public static MbtiResultDto Calculate(Dictionary<string, string> answers)
    {
        int scoreE = 0, scoreI = 0;
        int scoreS = 0, scoreN = 0;
        int scoreT = 0, scoreF = 0;
        int scoreJ = 0, scoreP = 0;

        foreach (var kv in answers)
        {
            switch (kv.Value.ToUpperInvariant())
            {
                case "E": scoreE++; break;
                case "I": scoreI++; break;
                case "S": scoreS++; break;
                case "N": scoreN++; break;
                case "T": scoreT++; break;
                case "F": scoreF++; break;
                case "J": scoreJ++; break;
                case "P": scoreP++; break;
            }
        }

        string typeE_I = scoreE >= scoreI ? "E" : "I";
        string typeS_N = scoreN >= scoreS ? "N" : "S";
        string typeT_F = scoreT >= scoreF ? "T" : "F";
        string typeJ_P = scoreJ >= scoreP ? "J" : "P";

        string code = $"{typeE_I}{typeS_N}{typeT_F}{typeJ_P}";

        var profile = GetProfile(code);
        profile.ScoreE = scoreE;
        profile.ScoreI = scoreI;
        profile.ScoreS = scoreS;
        profile.ScoreN = scoreN;
        profile.ScoreT = scoreT;
        profile.ScoreF = scoreF;
        profile.ScoreJ = scoreJ;
        profile.ScoreP = scoreP;

        return profile;
    }

    private static MbtiResultDto GetProfile(string code)
    {
        var profiles = new Dictionary<string, MbtiResultDto>
        {
            ["INTJ"] = new()
            {
                Code = "INTJ",
                Title = "Kiến Trúc Sư Chiến Lược (INTJ)",
                Nickname = "Chiến Lược Gia Tối Thượng",
                Overview = "Người sở hữu tư duy chiến lược bậc thầy, luôn khao khát tri thức và có kế hoạch tỉ mỉ cho mọi khía cạnh cuộc sống.",
                Strengths = new() { "Tư duy chiến lược và tầm nhìn xa", "Độc lập, quyết đoán và tự tin", "Không ngừng nâng cao năng lực bản thân" },
                Weaknesses = new() { "Quá khắt khe với người khác", "Dễ bị coi là lạnh lùng và kiêu hãnh", "Thiếu kiên nhẫn với sự mơ hồ" },
                SuitableCareers = new() { "Kiến trúc sư giải pháp phần mềm", "Chuyên gia hoạch định chiến lược", "Giám đốc tài chính", "Nhà nghiên cứu khoa học" },
                CompatibleTypes = new() { "ENFP", "ENTP", "INFJ" }
            },
            ["INTP"] = new()
            {
                Code = "INTP",
                Title = "Nhà Tư Duy Logic (INTP)",
                Nickname = "Bậc Thầy Lý Thuyết",
                Overview = "Những nhà phát minh sáng tạo với niềm đam mê bất tận dành cho logic, lý thuyết và giải mã cơ chế hoạt động của vũ trụ.",
                Strengths = new() { "Khả năng phân tích logic siêu phàm", "Tư duy sáng tạo độc đáo", "Khách quan và ham học hỏi" },
                Weaknesses = new() { "Dễ bị lơ đãng, sống trong thế giới suy tưởng", "Khó khăn trong việc bộc lộ cảm xúc", "Hay chần chừ thực thi" },
                SuitableCareers = new() { "Nhà khoa học dữ liệu", "Lập trình viên thuật toán", "Nhà triết học, nghiên cứu", "Chuyên gia an ninh mạng" },
                CompatibleTypes = new() { "ENTJ", "ENFJ", "INTJ" }
            },
            ["ENTJ"] = new()
            {
                Code = "ENTJ",
                Title = "Nhà Chỉ Huy Quyết Đoán (ENTJ)",
                Nickname = "Thống Soái Tiên Phong",
                Overview = "Lãnh đạo táo bạo, giàu trí tưởng tượng và có ý chí sắt đá, luôn tìm ra cách hoặc tự tạo ra con đường để chiến thắng.",
                Strengths = new() { "Kỹ năng lãnh đạo và điều hành xuất chúng", "Ý chí mạnh mẽ, kiên định", "Tư duy chiến lược xuất sắc" },
                Weaknesses = new() { "Đôi khi độc đoán và thiếu nhạy cảm cảm xúc", "Không khoan nhượng với sự chậm chạp", "Áp đặt quan điểm" },
                SuitableCareers = new() { "Tổng giám đốc (CEO)", "Chuyên gia tư vấn quản trị", "Thẩm phán, luật sư", "Doanh nhân khởi nghiệp" },
                CompatibleTypes = new() { "INTP", "INFP", "INTJ" }
            },
            ["ENTP"] = new()
            {
                Code = "ENTP",
                Title = "Người Tranh Biện Sáng Tạo (ENTP)",
                Nickname = "Bộ Não Đột Phá",
                Overview = "Những người thông minh, tò mò và thích thử thách trí tuệ, luôn tìm kiếm các góc nhìn độc đáo và phá vỡ lối mòn cũ.",
                Strengths = new() { "Nhanh trí, hoạt ngôn và sáng tạo", "Khả năng phát hiện cơ hội mới", "Không sợ phá bỏ giới hạn" },
                Weaknesses = new() { "Thích tranh luận đến cùng làm tổn thương người khác", "Khó tập trung vào việc triển khai chi tiết", "Mau chán" },
                SuitableCareers = new() { "Chuyên gia sáng tạo nội dung", "Nhà sáng lập Startup", "Luật sư tranh tụng", "Nhà ngoại giao" },
                CompatibleTypes = new() { "INFJ", "INTJ", "ENFP" }
            },
            ["INFJ"] = new()
            {
                Code = "INFJ",
                Title = "Người Cố Vấn Thấu Thị (INFJ)",
                Nickname = "Người Khai Sáng Thầm Lặng",
                Overview = "Nhóm tính cách hiếm nhất thế giới, lý tưởng hóa sâu sắc nhưng có khả năng biến giấc mơ thành hành động nhân văn cụ thể.",
                Strengths = new() { "Trực giác siêu nhạy bén và thấu cảm sâu sắc", "Lý tưởng cao đẹp và chân thành", "Truyền cảm hứng sâu sắc" },
                Weaknesses = new() { "Dễ bị kiệt sức vì lo lắng cho người khác", "Quá cầu toàn và sống khép kín", "Khó mở lòng hoàn toàn" },
                SuitableCareers = new() { "Bác sĩ tâm lý, cố vấn tâm linh", "Nhà văn, tác giả", "Giáo dục và nhân đạo", "Thiết kế trải nghiệm người dùng (UX)" },
                CompatibleTypes = new() { "ENTP", "ENFP", "INFP" }
            },
            ["INFP"] = new()
            {
                Code = "INFP",
                Title = "Người Hòa Giải Mộng Mơ (INFP)",
                Nickname = "Tâm Hồn Chân Thiện Mỹ",
                Overview = "Những người giàu lòng trắc ẩn, luôn tìm kiếm điều tốt đẹp ở người khác và hướng đến cuộc sống có ý nghĩa đạo đức sâu sắc.",
                Strengths = new() { "Đồng cảm sâu sắc và vị tha", "Tâm hồn nghệ thuật phong phú", "Trung thành với giá trị cốt lõi" },
                Weaknesses = new() { "Quá nhạy cảm trước lời phê bình", "Dễ rơi vào mơ mộng xa rời thực tế", "Khó khăn khi ra quyết định dứt khoát" },
                SuitableCareers = new() { "Nhà văn, tiểu thuyết gia", "Họa sĩ, nghệ sĩ sáng tác", "Chuyên gia tư vấn tâm lý", "Hoạt động xã hội phi lợi nhuận" },
                CompatibleTypes = new() { "ENFJ", "ENTJ", "INFJ" }
            },
            ["ENFJ"] = new()
            {
                Code = "ENFJ",
                Title = "Người Truyền Cảm Hứng (ENFJ)",
                Nickname = "Ngọn Hải Đăng Dẫn Lối",
                Overview = "Lãnh đạo lôi cuốn và nhiệt huyết, có khả năng làm mê hoặc người nghe và dẫn dắt tập thể cùng phát triển rực rỡ.",
                Strengths = new() { "Sức hút cá nhân và kỹ năng giao tiếp tuyệt đỉnh", "Đồng cảm và luôn nâng đỡ người khác", "Tổ chức đội ngũ gắn kết" },
                Weaknesses = new() { "Dễ quá tải vì nhận việc của mọi người", "Quá lý tưởng hóa con người", "Dễ bị tổn thương nếu bị phụ lòng" },
                SuitableCareers = new() { "Giám đốc nhân sự", "Diễn giả truyền cảm hứng", "Giảng viên đại học", "Nhà ngoại giao, chính trị gia" },
                CompatibleTypes = new() { "INFP", "ISFP", "INFJ" }
            },
            ["ENFP"] = new()
            {
                Code = "ENFP",
                Title = "Người Vận Động Nhiệt Huyết (ENFP)",
                Nickname = "Tia Sáng Đầy Đam Mê",
                Overview = "Những tâm hồn tự do, giàu lòng nhiệt tình, sáng tạo và luôn tìm thấy lý do để mỉm cười và kết nối mọi người lại với nhau.",
                Strengths = new() { "Tràn đầy nhiệt huyết và năng lượng tích cực", "Sáng tạo vô biên", "Khả năng kết nối con người phi thường" },
                Weaknesses = new() { "Dễ mất tập trung khi có điều mới mẻ", "Suy nghĩ quá nhiều (Overthinking)", "Thiếu kiên nhẫn với việc lặp lại" },
                SuitableCareers = new() { "Giám đốc sáng tạo (Creative Director)", "Chuyên gia Marketing / PR", "Phóng viên, nhà báo", "Nhà tâm lý học" },
                CompatibleTypes = new() { "INTJ", "INFJ", "ENTP" }
            },
            ["ISTJ"] = new()
            {
                Code = "ISTJ",
                Title = "Người Trách Nhiệm Chu Toàn (ISTJ)",
                Nickname = "Thanh Tra Đáng Tin Cậy",
                Overview = "Người thực tế, trung thực và tận tâm với bổn phận. Tính kỷ luật và trách nhiệm của họ là nền móng cho mọi tổ chức thành công.",
                Strengths = new() { "Độ tin cậy và trách nhiệm tuyệt đối", "Ngăn nắp, quy củ và bình tĩnh", "Tuân thủ lời hứa" },
                Weaknesses = new() { "Cứng nhắc, khó chấp nhận cái mới lạ", "Dễ phán xét người thiếu kỷ luật", "Khó thích nghi với thay đổi đột xuất" },
                SuitableCareers = new() { "Kiểm toán viên, kế toán trưởng", "Sĩ quan quân đội / an ninh", "Kỹ sư giám sát công trình", "Quản lý chuỗi cung ứng" },
                CompatibleTypes = new() { "ESFP", "ESTP", "ISFJ" }
            },
            ["ISFJ"] = new()
            {
                Code = "ISFJ",
                Title = "Người Bảo Vệ Tận Tụy (ISFJ)",
                Nickname = "Thiên Thần Hộ Mệnh",
                Overview = "Những người bảo vệ tận tâm và ấm áp, luôn sẵn sàng che chở và chăm sóc cho những người thân yêu và cộng đồng.",
                Strengths = new() { "Tận tụy, chu đáo và kiên nhẫn", "Kỹ năng thực hành tốt", "Đáng tin cậy và trung thành" },
                Weaknesses = new() { "Quá khiêm tốn, dễ bị lợi dụng công sức", "Ngại thay đổi nếp sống quen thuộc", "Kìm nén cảm xúc cá nhân" },
                SuitableCareers = new() { "Bác sĩ gia đình, điều dưỡng", "Giáo viên tiểu học", "Chuyên viên chăm sóc khách hàng", "Thư viện viên" },
                CompatibleTypes = new() { "ESFP", "ESTP", "ISTJ" }
            },
            ["ESTJ"] = new()
            {
                Code = "ESTJ",
                Title = "Người Quản Lý Mẫu Mực (ESTJ)",
                Nickname = "Trụ Cột Kỷ Cương",
                Overview = "Những nhà quản trị xuất sắc, điều hành mọi việc theo trật tự và quy tắc rõ ràng, kết nối mọi người để đạt hiệu suất cao nhất.",
                Strengths = new() { "Kỹ năng tổ chức và quản trị tuyệt vời", "Tận tâm, thẳng thắn và đáng tin", "Tạo ra sự ổn định vững chắc" },
                Weaknesses = new() { "Cứng nhắc, thiếu linh hoạt", "Khó bày tỏ cảm xúc mềm mỏng", "Hay áp đặt tiêu chuẩn của mình" },
                SuitableCareers = new() { "Giám đốc vận hành (COO)", "Quản lý nhà máy, chuỗi cung ứng", "Cảnh sát, thẩm phán", "Kinh doanh bất động sản" },
                CompatibleTypes = new() { "ISFP", "ISTP", "ESFJ" }
            },
            ["ESFJ"] = new()
            {
                Code = "ESFJ",
                Title = "Người Chăm Sóc Hòa Hảo (ESFJ)",
                Nickname = "Trái Tim Của Tập Thể",
                Overview = "Những người hòa đồng, chu đáo và luôn mong muốn mang lại niềm vui, sự gắn kết và ấm áp cho mọi người xung quanh.",
                Strengths = new() { "Kỹ năng quan hệ xã hội xuất sắc", "Ấm áp, chu đáo và trung thành", "Có tinh thần trách nhiệm cộng đồng cao" },
                Weaknesses = new() { "Dễ bị tổn thương nếu không được ghi nhận", "Sợ bị cô lập xã hội", "Quá bận tâm đến ánh nhìn của người khác" },
                SuitableCareers = new() { "Quản lý sự kiện, lễ tân ngoại giao", "Giám đốc nhân sự", "Bác sĩ, điều dưỡng trưởng", "Giáo viên" },
                CompatibleTypes = new() { "ISFP", "ISTP", "ESTJ" }
            },
            ["ISTP"] = new()
            {
                Code = "ISTP",
                Title = "Nghệ Nhân Khéo Léo (ISTP)",
                Nickname = "Bậc Thầy Kỹ Thuật",
                Overview = "Những người thực nghiệm táo bạo và thực tế, thành thạo trong việc làm chủ các công cụ, máy móc và giải quyết sự cố kỹ thuật.",
                Strengths = new() { "Khả năng ứng biến tình huống khẩn cấp tuyệt vời", "Thực tế, khéo léo và tự lập", "Bình tĩnh trước áp lực" },
                Weaknesses = new() { "Dễ cảm thấy nhàm chán", "Khó đoán và sống quá kín đáo", "Ngại cam kết lâu dài" },
                SuitableCareers = new() { "Kỹ sư cơ khí, tự động hóa", "Phi công, tay đua xe chuyên nghiệp", "Chuyên viên điều tra hiện trường", "Lập trình viên nhúng" },
                CompatibleTypes = new() { "ESTJ", "ESFJ", "ISFP" }
            },
            ["ISFP"] = new()
            {
                Code = "ISFP",
                Title = "Nghệ Sĩ Tài Hoa (ISFP)",
                Nickname = "Tâm Hồn Tự Do Phóng Khoáng",
                Overview = "Những người nghệ sĩ linh hoạt và duyên dáng, luôn sẵn sàng khám phá và trải nghiệm những điều mới mẻ mang tính thẩm mỹ cao.",
                Strengths = new() { "Gu thẩm mỹ tinh tế và sáng tạo", "Ấm áp, nhạy cảm và bao dung", "Sống trọn vẹn trong khoảnh khắc hiện tại" },
                Weaknesses = new() { "Dễ bị căng thẳng khi bị gò bó", "Quá độc lập, khó lập kế hoạch dài hạn", "Hay tự ti về năng lực" },
                SuitableCareers = new() { "Họa sĩ, nhà thiết kế thời trang / nội thất", "Nhiếp ảnh gia chuyên nghiệp", "Đầu bếp cao cấp", "Nhà trị liệu âm nhạc" },
                CompatibleTypes = new() { "ESFJ", "ESTJ", "ENFJ" }
            },
            ["ESTP"] = new()
            {
                Code = "ESTP",
                Title = "Người Thực Thi Táo Bạo (ESTP)",
                Nickname = "Cơn Lốc Hành Động",
                Overview = "Những người thông minh, tràn đầy năng lượng và rất nhạy bén, luôn thích sống trên lằn ranh mạo hiểm và tận hưởng thành công.",
                Strengths = new() { "Dũng cảm, hành động chớp nhoáng", "Kỹ năng đàm phán và thuyết phục thực tế", "Trực giác xã hội sắc bén" },
                Weaknesses = new() { "Thiếu kiên nhẫn với lý thuyết dài dòng", "Dễ liều lĩnh và chấp nhận rủi ro quá mức", "Khó duy trì sự tập trung" },
                SuitableCareers = new() { "Doanh nhân kinh doanh mạo hiểm", "Môi giới chứng khoán / tài chính", "Cảnh sát hình sự", "Huấn luyện viên thể thao" },
                CompatibleTypes = new() { "ISFJ", "ISTJ", "ESFP" }
            },
            ["ESFP"] = new()
            {
                Code = "ESFP",
                Title = "Người Trình Diễn Hoạt Bát (ESFP)",
                Nickname = "Ngôi Sao Tỏa Sáng",
                Overview = "Những người tràn đầy tự phát, yêu đời và nhiệt huyết, cuộc sống xung quanh họ không bao giờ tẻ nhạt.",
                Strengths = new() { "Lạc quan, cuốn hút và cởi mở", "Biết cách tận hưởng cuộc sống", "Đồng cảm và giúp đỡ mọi người vui vẻ" },
                Weaknesses = new() { "Dễ bị phân tâm bởi niềm vui nhất thời", "Khó khăn trong việc tích lũy tài chính dài hạn", "Ngại xung đột" },
                SuitableCareers = new() { "Nghệ sĩ biểu diễn, MC, diễn viên", "Quản lý tour du lịch cao cấp", "Tổ chức sự kiện tiệc cưới", "Chuyên viên truyền thông giải trí" },
                CompatibleTypes = new() { "ISTJ", "ISFJ", "ESTP" }
            }
        };

        if (profiles.TryGetValue(code, out var found))
        {
            return found;
        }

        return profiles["INTJ"];
    }
}
