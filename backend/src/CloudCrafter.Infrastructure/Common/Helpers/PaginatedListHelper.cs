using CloudCrafter.Core.Common.Responses;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Infrastructure.Common.Helpers;


public static class PaginatedListHelper 
{

    public const int DefaultPageSize = 15;
    public const int DefaultCurrentPage = 1;

    public static async Task<PaginatedList<T>> ToPaginatedListAsync<T>(this IQueryable<T> source, int currentPage, int pageSize)
    {
        currentPage = currentPage > 0 ? currentPage : DefaultCurrentPage;
        pageSize = pageSize > 0 ? pageSize : DefaultPageSize;
        var count = await source.CountAsync();
        var items = await source.Skip((currentPage - 1) * pageSize).Take(pageSize).ToListAsync();
        return new PaginatedList<T>(items, count, currentPage, pageSize);
    }
}
