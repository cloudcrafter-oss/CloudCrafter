using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Models;

namespace CloudCrafter.Web.Infrastructure.OpenApi;

public class CommandSchemaNameTransformer : IOpenApiSchemaTransformer
{
    public Task TransformAsync(OpenApiSchema schema, OpenApiSchemaTransformerContext context,
        CancellationToken cancellationToken)
    {
        if (context.JsonPropertyInfo == null)
        {
            var type = context.JsonTypeInfo.Type;
            // var schemaType = typeof(CreateStackCommand.Command);
            // if (type == schemaType)
            // {
            var fullName = type.FullName;
            if (!string.IsNullOrWhiteSpace(fullName) && fullName.Contains("+"))
            {
                var parts = fullName.Split('.');
                var lastPart = parts[^1];
                var commandParts = lastPart.Split('+');
                schema.Title = string.Join("", commandParts);

                schema.Annotations["x-schema-id"] = schema.Title;

                // x-schema-id
            }
        }

        return Task.CompletedTask;
    }
}
