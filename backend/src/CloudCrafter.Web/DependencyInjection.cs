using System.Reflection;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Infrastructure;
using CloudCrafter.Infrastructure.Core.Configuration;
using CloudCrafter.Infrastructure.Data;
using CloudCrafter.Web.Infrastructure;
using CloudCrafter.Web.Infrastructure.Services;
using CloudCrafter.Web.Infrastructure.Swagger;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;

namespace CloudCrafter.Web;

public static class DependencyInjection
{
    public static IServiceCollection AddApiConfiguration(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddOptions<JwtSettings>()
            .BindConfiguration(JwtSettings.KEY)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddOptions<CorsSettings>()
            .BindConfiguration(CorsSettings.KEY)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddCloudCrafterConfiguration();

        return services;
    }


    public static IServiceCollection AddSwaggerServices(this IServiceCollection collection)
    {
        collection.AddEndpointsApiExplorer()
            .AddSwaggerGen(swagger =>
            {
                var defaultSchemaIdSelector = swagger.SchemaGeneratorOptions.SchemaIdSelector;

                swagger.CustomSchemaIds(type =>
                {
                    if (type.MemberType == MemberTypes.NestedType)
                    {
                        var parentType = type.DeclaringType;
                        return parentType!.Name + type.Name;
                    }

                    return defaultSchemaIdSelector(type);
                });
                swagger.SupportNonNullableReferenceTypes();
                swagger.SchemaFilter<RequireNotNullableSchemaFilter>();
                swagger.OperationFilter<FilterableFieldsOperationFilter>();

                swagger.AddSecurityDefinition("Bearer",
                    new OpenApiSecurityScheme
                    {
                        In = ParameterLocation.Header,
                        Description = "Please enter a valid token",
                        Name = "Authorization",
                        Type = SecuritySchemeType.Http,
                        BearerFormat = "JWT",
                        Scheme = "Bearer"
                    });


                swagger.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                        },
                        new string[] { }
                    }
                });
            });

        return collection;
    }

    public static IServiceCollection AddWebServices(this IServiceCollection services)
    {
        services.AddDatabaseDeveloperPageExceptionFilter();

        services.AddScoped<IUser, CurrentUser>();

        services.AddHttpContextAccessor();

        services.AddHealthChecks()
            .AddDbContextCheck<AppDbContext>();

        services.AddExceptionHandler<CustomExceptionHandler>();

        services.AddRazorPages();

        // Customise default API behaviour
        services.Configure<ApiBehaviorOptions>(options =>
            options.SuppressModelStateInvalidFilter = true);

        services.AddEndpointsApiExplorer();


        return services;
    }
}
