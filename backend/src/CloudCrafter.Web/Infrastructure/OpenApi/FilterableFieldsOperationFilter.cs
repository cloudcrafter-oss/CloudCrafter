// using System.Reflection;
// using CloudCrafter.Domain.Common.Filtering;
// using Microsoft.OpenApi.Any;
// using Microsoft.OpenApi.Models;
// using Swashbuckle.AspNetCore.SwaggerGen;
//
// namespace CloudCrafter.Web.Infrastructure.Swagger;
//
// public class FilterableFieldsOperationFilter : IOperationFilter
// {
//     public void Apply(OpenApiOperation operation, OperationFilterContext context)
//     {
//         var filterableFields = GetFilterableFields(context.MethodInfo.DeclaringType);
//
//         if (filterableFields.Any())
//         {
//             var openApiArray = new OpenApiArray();
//             foreach (var field in filterableFields)
//             {
//                 openApiArray.Add(new OpenApiString(field));
//             }
//
//             operation.Extensions.Add("x-filterable-fields", openApiArray);
//         }
//     }
//
//     private static IEnumerable<string> GetFilterableFields(Type? type)
//     {
//         if (type == null)
//             return Enumerable.Empty<string>();
//
//         return type.GetProperties()
//             .Where(p => p.GetCustomAttribute<FilterableAttribute>() != null)
//             .Select(p => p.Name);
//     }
// }
