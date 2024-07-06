namespace CloudCrafter.Domain.Common.Pagination;

public record PaginationOptions
{
    public int? PageSize { get; init; }
    public int? Page { get; init; }
}
