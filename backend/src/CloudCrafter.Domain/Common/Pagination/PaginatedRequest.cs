using CloudCrafter.Domain.Common.Filtering;
using CloudCrafter.Domain.Common.Sorting;
using CloudCrafter.Domain.Requests.Filtering;

namespace CloudCrafter.Domain.Common.Pagination;

public class PaginatedRequest<TDto> : BasePaginationRequest
{
    public List<FilterCriterea> Filters { get; init; } = new List<FilterCriterea>();
    public SortModel[]? SortBy { get; init; }
}
