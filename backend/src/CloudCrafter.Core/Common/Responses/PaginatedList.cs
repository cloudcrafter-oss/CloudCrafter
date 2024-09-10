namespace CloudCrafter.Core.Common.Responses;

public record PaginatedList<T>
{
    public int Page { get; init; }
    public int TotalPages { get; init; }
    public int TotalItems { get; init; }

    public List<T> Result { get; init; } = new List<T>();

    public PaginatedList(List<T> items, int count, int page, int pageSize)
    {
        Page = page;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
        TotalItems = count;
        Result.AddRange(items);
    }

    public PaginatedList() { }
}
