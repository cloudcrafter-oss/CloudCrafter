// using Microsoft.OpenApi.Models;
//
//
// namespace CloudCrafter.Web.Infrastructure.Swagger;
//
// public class RequireNotNullableSchemaFilter : ISchemaFilter
// {
//     public void Apply(OpenApiSchema schema, SchemaFilterContext context)
//     {
//         var additionalRequiredProps = schema
//             .Properties.Where(x => !x.Value.Nullable && !schema.Required.Contains(x.Key))
//             .Select(x => x.Key);
//         foreach (var propKey in additionalRequiredProps)
//         {
//             schema.Required.Add(propKey);
//         }
//     }
// }
