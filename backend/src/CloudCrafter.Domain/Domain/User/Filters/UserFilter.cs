using CloudCrafter.Domain.Common.Pagination;
using CloudCrafter.Domain.Common.Sorting;

namespace CloudCrafter.Domain.Domain.User.Filters;

public record UserFilter : PaginationOptions
{
    public SortModel[]? SortBy { get; init; }
}
