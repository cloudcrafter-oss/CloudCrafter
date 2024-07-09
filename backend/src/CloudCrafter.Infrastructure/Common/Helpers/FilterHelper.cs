using System.Reflection;
using CloudCrafter.Domain.Common.Filtering;

namespace CloudCrafter.Infrastructure.Common.Helpers;

public static class FilterHelper
{
    public static HashSet<string> GetFilterableProperties<TDto>()
    {
        return typeof(TDto)
            .GetProperties()
            .Where(p => p.GetCustomAttribute<FilterableAttribute>() != null)
            .Select(p => p.Name)
            .ToHashSet();
    }
}
