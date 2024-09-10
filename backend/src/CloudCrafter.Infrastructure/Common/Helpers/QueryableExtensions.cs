using System.Linq.Expressions;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using CloudCrafter.Core.Common.Responses;
using CloudCrafter.Domain.Common.Filtering;
using CloudCrafter.Domain.Common.Pagination;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Infrastructure.Common.Helpers;

public static class QueryableExtensions
{
    public static async Task<PaginatedList<TDto>> ToPaginatedListAsync<TEntity, TDto>(
        this IQueryable<TEntity> query,
        PaginatedRequest<TDto> request,
        IMapper mapper
    )
        where TDto : class
        where TEntity : class
    {
        query = query.ApplyFiltering<TDto, TEntity>(request.Filters);

        var totalCount = await query.CountAsync();

        // TODO: Sorting

        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ProjectTo<TDto>(mapper.ConfigurationProvider)
            .ToListAsync();

        return new PaginatedList<TDto>(items, totalCount, request.Page, request.PageSize);
    }

    public static IQueryable<TEntity> ApplyFiltering<TDto, TEntity>(
        this IQueryable<TEntity> query,
        System.Collections.Generic.List<FilterCriterea> filters
    )
    {
        if (filters == null || !filters.Any())
            return query;

        var filterableProperties = FilterHelper.GetFilterableProperties<TDto>();

        var parameter = Expression.Parameter(typeof(TEntity), "x");

        foreach (var filter in filters)
        {
            if (!filterableProperties.Contains(filter.PropertyName))
            {
                throw new ArgumentException(
                    $"Filtering on property '{filter.PropertyName}' is not allowed."
                );
            }

            var property = Expression.Property(parameter, filter.PropertyName);
            var constant = Expression.Constant(filter.Value);

            Expression comparison = filter.Operator switch
            {
                FilterOperatorOption.Equal => Expression.Equal(property, constant),
                FilterOperatorOption.NotEqual => Expression.NotEqual(property, constant),
                FilterOperatorOption.GreaterThan => Expression.GreaterThan(property, constant),
                FilterOperatorOption.GreaterThanOrEqual => Expression.GreaterThanOrEqual(
                    property,
                    constant
                ),
                FilterOperatorOption.LessThan => Expression.LessThan(property, constant),
                FilterOperatorOption.LessThanOrEqual => Expression.LessThanOrEqual(
                    property,
                    constant
                ),
                FilterOperatorOption.Contains => Expression.Call(
                    property,
                    typeof(string).GetMethod("Contains", new[] { typeof(string) })!,
                    constant
                ),
                _ => throw new NotSupportedException(
                    $"Operator {filter.Operator} is not supported."
                ),
            };

            var lambda = Expression.Lambda<Func<TEntity, bool>>(comparison, parameter);
            query = query.Where(lambda);
        }

        return query;
    }
}
