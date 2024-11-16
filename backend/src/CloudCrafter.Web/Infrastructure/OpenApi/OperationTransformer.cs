using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Models;

namespace CloudCrafter.Web.Infrastructure.OpenApi;

public class OperationTransformer : IOpenApiOperationTransformer
{
    public Task TransformAsync(OpenApiOperation operation, OpenApiOperationTransformerContext context,
        CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
