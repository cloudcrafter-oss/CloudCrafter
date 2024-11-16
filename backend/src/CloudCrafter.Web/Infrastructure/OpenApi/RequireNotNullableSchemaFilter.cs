using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Models;

namespace CloudCrafter.Web.Infrastructure.OpenApi;

public class RequireNotNullableSchemaFilter : IOpenApiSchemaTransformer
{
    // public Task TransformAsync(OpenApiDocument document, OpenApiDocumentTransformerContext context,
    //     CancellationToken cancellationToken)
    // {
    //     if (document.Components == null)
    //     {
    //         return Task.CompletedTask;
    //     }
    //
    //     foreach (var schema in document.Components.Schemas)
    //     {
    //         if (schema.Value.Properties == null)
    //         {
    //             continue;
    //         }
    //
    //         foreach (var property in schema.Value.Properties)
    //         {
    //             if (!property.Value.Nullable)
    //             {
    //                 schema.Value.Required.Add(property.Key);
    //             }
    //         }
    //     }
    //
    //     return Task.CompletedTask;
    // }

    public Task TransformAsync(OpenApiSchema schema, OpenApiSchemaTransformerContext context,
        CancellationToken cancellationToken)
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
