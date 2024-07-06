using System.Linq.Expressions;
using CloudCrafter.Utils.Helpers;

namespace CloudCrafter.Domain.Common.Sorting;

public record SortModel(string Field, SortDirection Direction = SortDirection.Ascending)
{
    public static SortModel Create<T>(
        Expression<Func<T, object>> sortByField,
        SortDirection direction = SortDirection.Ascending
    )
    {
        var sortBy = FieldPathHelpers<T>.GetFieldPath(sortByField);
        return new(sortBy, direction);
    }
}

public enum SortDirection
{
    Descending = 0,
    Ascending = 1,
}
