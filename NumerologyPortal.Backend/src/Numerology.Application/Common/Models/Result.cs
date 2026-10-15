namespace Numerology.Application.Common.Models;

public class Result<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public List<string> Errors { get; set; } = new();

    public static Result<T> Ok(T data, string message = "Thành công")
    {
        return new Result<T> { Success = true, Message = message, Data = data };
    }

    public static Result<T> Fail(string error, string message = "Thất bại")
    {
        return new Result<T> { Success = false, Message = message, Errors = new List<string> { error } };
    }

    public static Result<T> Fail(List<string> errors, string message = "Thất bại")
    {
        return new Result<T> { Success = false, Message = message, Errors = errors };
    }
}

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageIndex { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / Math.Max(1, PageSize));
}
