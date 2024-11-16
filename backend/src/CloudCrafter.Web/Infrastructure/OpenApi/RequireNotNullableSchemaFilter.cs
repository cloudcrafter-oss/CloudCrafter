using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Models;

namespace CloudCrafter.Web.Infrastructure.OpenApi;

public class RequireNotNullableSchemaFilter : IOpenApiSchemaTransformer
{
    public Task TransformAsync(
        OpenApiSchema schema,
        OpenApiSchemaTransformerContext context,
        CancellationToken cancellationToken
    )
    {
        if (schema.Properties == null)
        {
            return Task.CompletedTask;
        }

        schema.Required ??= new HashSet<string>();

        foreach (var property in schema.Properties)
        {
            if (!property.Value.Nullable)
            {
                schema.Required.Add(property.Key);
            }
        }

        return Task.CompletedTask;
    }
}
