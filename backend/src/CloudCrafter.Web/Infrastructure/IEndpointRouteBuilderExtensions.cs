using System.Diagnostics.CodeAnalysis;
using Ardalis.GuardClauses;

namespace CloudCrafter.Web.Infrastructure;

public static class IEndpointRouteBuilderExtensions
{
    public static IEndpointRouteBuilder MapGet(
        this IEndpointRouteBuilder builder,
        Delegate handler,
        [StringSyntax("Route")] string pattern = ""
    )
    {
        Guard.Against.AnonymousMethod(handler);

        builder.MapGet(pattern, handler).WithName(handler.Method.Name).WithOpenApi();

        return builder;
    }

    public static IEndpointRouteBuilder MapPost(
        this IEndpointRouteBuilder builder,
        Delegate handler,
        [StringSyntax("Route")] string pattern = "",
        Action<RouteHandlerBuilder>? configure = null
    )
    {
        Guard.Against.AnonymousMethod(handler);

        var router = builder.MapPost(pattern, handler).WithName(handler.Method.Name);

        configure?.Invoke(router);

        return builder;
    }

    public static IEndpointRouteBuilder MapPut(
        this IEndpointRouteBuilder builder,
        Delegate handler,
        [StringSyntax("Route")] string pattern
    )
    {
        Guard.Against.AnonymousMethod(handler);

        builder.MapPut(pattern, handler).WithName(handler.Method.Name);

        return builder;
    }

    public static IEndpointRouteBuilder MapPatch(
        this IEndpointRouteBuilder builder,
        Delegate handler,
        [StringSyntax("Route")] string pattern
    )
    {
        Guard.Against.AnonymousMethod(handler);

        builder.MapPatch(pattern, handler).WithName(handler.Method.Name);

        return builder;
    }

    public static IEndpointRouteBuilder MapDelete(
        this IEndpointRouteBuilder builder,
        Delegate handler,
        [StringSyntax("Route")] string pattern
    )
    {
        Guard.Against.AnonymousMethod(handler);

        builder.MapDelete(pattern, handler).WithName(handler.Method.Name);

        return builder;
    }
}
