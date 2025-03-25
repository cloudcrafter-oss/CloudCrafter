using CloudCrafter.Core.Commands.Auth;
using CloudCrafter.Domain.Domain.Auth;
using CloudCrafter.Web.Infrastructure;
using MediatR;

namespace CloudCrafter.Web.Endpoints;

public class Auth : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapPost(
                PostLoginUser,
                "login",
                config =>
                {
                    config.WithTags("CloudCrafterAuth");
                }
            )
            .MapPost(
                PostCreateUser,
                "create",
                config =>
                {
                    config.WithTags("CloudCrafterAuth");
                }
            )
            .MapPost(
                PostRefreshTokens,
                "refresh",
                config =>
                {
                    config.WithTags("CloudCrafterAuth");
                }
            );
    }

    public async Task<TokenDto> PostLoginUser(ISender sender, LoginUserCommand query)
    {
        return await sender.Send(query);
    }

    public async Task<TokenDto> PostCreateUser(ISender sender, CreateUserCommand query)
    {
        return await sender.Send(query);
    }

    public async Task<TokenDto> PostRefreshTokens(ISender sender, RefreshUserTokenCommand query)
    {
        return await sender.Send(query);
    }
}
