using System.Text.Json.Serialization.Metadata;
using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces;
using CloudCrafter.Infrastructure;
using CloudCrafter.Infrastructure.Core.Configuration;
using CloudCrafter.Infrastructure.Data;
using CloudCrafter.Web.Infrastructure;
using CloudCrafter.Web.Infrastructure.OpenApi;
using CloudCrafter.Web.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OpenApi;
using Polly;

namespace CloudCrafter.Web;

public static class DependencyInjection
{
    public static IServiceCollection AddApiConfiguration(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services
            .AddOptions<JwtSettings>()
            .BindConfiguration(JwtSettings.KEY)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services
            .AddOptions<CorsSettings>()
            .BindConfiguration(CorsSettings.KEY)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddCloudCrafterConfiguration();

        return services;
    }

    public static IServiceCollection AddCloudCrafterCors(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.AddCors(options =>
        {
            options.AddPolicy(
                "CloudCrafterCorsPolicy",
                policy =>
                {
                    var corsSettings = configuration
                        .GetSection(CorsSettings.KEY)
                        .Get<CorsSettings>();

                    if (corsSettings?.AllowedOrigins != null && corsSettings.AllowedOrigins.Any())
                    {
                        policy.WithOrigins(corsSettings.AllowedOrigins.ToArray());
                    }
                    else
                    {
                        policy.AllowAnyOrigin();
                    }

                    policy.AllowAnyMethod().AllowCredentials().AllowAnyHeader();
                }
            );
        });

        return services;
    }

    public static IServiceCollection AddOpenApiServices(this IServiceCollection collection)
    {
        collection.AddOpenApi(options =>
        {
            options.AddSchemaTransformer<RequireNotNullableSchemaFilter>();
            //  .AddSchemaTransformer<CommandSchemaNameTransformer>();

            // options.CreateSchemaReferenceId = info =>
            // {
            //
            //     return info.getschemareferenceid
            // };

            // options.AddSchemaTransformer(
            //     (schema, context, ct) =>
            //     {
            //         if (schema.Type == "object" && schema.Properties != null)
            //         {
            //             var allPropertiesNullable = schema.Properties.Values.All(prop =>
            //                 prop.Nullable == true
            //             );
            //
            //             if (allPropertiesNullable)
            //             {
            //                 // Prevent the "GitSettings" case
            //                 // This was when all properties were nullable
            //                 // But the object itself default value was "null".
            //                 // Zod had some issues with this for frontend generation
            //                 schema.Default = null;
            //                 schema.Nullable = false;
            //             }
            //         }
            //
            //         return Task.CompletedTask;
            //     }
            // );

            options.CreateSchemaReferenceId = (JsonTypeInfo info) =>
            {
                var schema = OpenApiOptions.CreateDefaultSchemaReferenceId(info);

                if (schema is not ("Query" or "Command"))
                {
                    return schema;
                }

                var type = info.Type;

                var fullName = type.FullName;

                if (string.IsNullOrWhiteSpace(fullName))
                {
                    return schema;
                }

                var parts = fullName.Split('.');
                var lastPart = parts[^1];
                var commandParts = lastPart.Split(['+']);

                return string.Join("", commandParts);
            };

            // options.AddDocumentTransformer((doc, context, ct) =>
            // {
            //     var gitSettings = typeof(UpdateStackCommand.GitSettings);
            //     if (context. == null)
            //     {
            //         var type = context.JsonTypeInfo.Type;
            //
            //         if (type == gitSettings)
            //         {
            //
            //         }
            //     }
            //     return Task.CompletedTask;
            // });
            options.AddDocumentTransformer(
                (doc, context, ct) =>
                {
                    doc.Info.Title = "CloudCrafter API";
                    doc.Info.Version = "v1";

                    // Removed for Kubb generation to prevent baseURL being added to clients
                    doc.Servers = [];
                    return Task.CompletedTask;
                }
            );
        });
        return collection;
    }

    public static IServiceCollection AddWebServices(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.AddDatabaseDeveloperPageExceptionFilter();

        services.AddScoped<IUser, CurrentUser>();
        services.AddScoped<ICloudCrafterEnvironmentConfig, WebCloudCrafterEnvironmentConfig>();

        services.AddHttpContextAccessor();

        services.AddHealthChecks().AddDbContextCheck<AppDbContext>();

        services.AddExceptionHandler<CustomExceptionHandler>();

        services.AddRazorPages();

        // Customise default API behaviour
        services.Configure<ApiBehaviorOptions>(options =>
            options.SuppressModelStateInvalidFilter = true
        );

        services.AddEndpointsApiExplorer();

        return services;
    }
}
