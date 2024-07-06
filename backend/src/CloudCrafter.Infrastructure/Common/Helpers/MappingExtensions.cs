using System.Linq.Expressions;

namespace CloudCrafter.Infrastructure.Common.Helpers;

public static class MappingExtensions
{
    public static Expression<Func<TEntity, object>> MapSortExpression<TDto, TEntity>(string dtoProperty)
    {
        var entityType = typeof(TEntity);
        var parameter = Expression.Parameter(entityType, "e");
        var property = entityType.GetProperty(dtoProperty);

        if (property == null)
            throw new ArgumentException($"Property {dtoProperty} not found on entity {entityType.Name}");

        var propertyAccess = Expression.Property(parameter, property);
        var conversion = Expression.Convert(propertyAccess, typeof(object));
        return Expression.Lambda<Func<TEntity, object>>(conversion, parameter);
    }
}
