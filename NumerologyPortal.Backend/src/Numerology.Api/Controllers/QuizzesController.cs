using Microsoft.AspNetCore.Mvc;
using Numerology.Application.Common.Models;
using Numerology.Application.Services.DiscMbtiEngine;

namespace Numerology.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuizzesController : ControllerBase
{
    /// <summary>
    /// Lấy danh sách câu hỏi trắc nghiệm DISC
    /// </summary>
    [HttpGet("disc/questions")]
    public ActionResult<Result<List<DiscQuestion>>> GetDiscQuestions()
    {
        return Ok(Result<List<DiscQuestion>>.Ok(DiscEngine.GetQuestions()));
    }

    /// <summary>
    /// Chấm điểm và luận giải kết quả trắc nghiệm DISC
    /// </summary>
    [HttpPost("disc")]
    public ActionResult<Result<DiscResultDto>> SubmitDisc([FromBody] List<string> selectedTraits)
    {
        if (selectedTraits == null || selectedTraits.Count == 0)
        {
            return BadRequest(Result<DiscResultDto>.Fail("Vui lòng trả lời các câu hỏi trắc nghiệm."));
        }

        var result = DiscEngine.Calculate(selectedTraits);
        return Ok(Result<DiscResultDto>.Ok(result, "Đã tính toán kết quả DISC thành công!"));
    }

    /// <summary>
    /// Lấy danh sách câu hỏi trắc nghiệm MBTI (16 nhóm tính cách)
    /// </summary>
    [HttpGet("mbti/questions")]
    public ActionResult<Result<List<MbtiQuestion>>> GetMbtiQuestions()
    {
        return Ok(Result<List<MbtiQuestion>>.Ok(MbtiEngine.GetQuestions()));
    }

    /// <summary>
    /// Chấm điểm và phân tích chi tiết loại tính cách MBTI
    /// </summary>
    [HttpPost("mbti")]
    public ActionResult<Result<MbtiResultDto>> SubmitMbti([FromBody] Dictionary<string, string> answers)
    {
        if (answers == null || answers.Count == 0)
        {
            return BadRequest(Result<MbtiResultDto>.Fail("Vui lòng hoàn thành bài trắc nghiệm."));
        }

        var result = MbtiEngine.Calculate(answers);
        return Ok(Result<MbtiResultDto>.Ok(result, "Đã phân tích kết quả MBTI thành công!"));
    }
}
