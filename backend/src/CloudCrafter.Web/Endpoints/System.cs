using System.Reflection;
using CloudCrafter.Domain.Common.Filtering;
using CloudCrafter.Web.Infrastructure;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace CloudCrafter.Web.Endpoints;

public class System : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapGet(GetFilterableFields, "get-fields");
    }

    public Dictionary<string, List<string>> GetFilterableFields()
    {
        var filterableDtos = typeof(IFilterableDto).Assembly.GetTypes()
            .Where(t => typeof(IFilterableDto).IsAssignableFrom(t) && !t.IsInterface && !t.IsAbstract)
            .ToDictionary(
                t => t.Name,
                t => t.GetProperties()
                    .Where(p => p.GetCustomAttribute<FilterableAttribute>() != null)
                    .Select(p => p.Name)
                    .ToList()
            );

        return filterableDtos;
    }
}
