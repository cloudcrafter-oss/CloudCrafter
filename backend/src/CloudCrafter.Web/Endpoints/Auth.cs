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
            .MapPost(PostLoginUser, "login")
            .MapPost(PostCreateUser, "create")
            .MapPost(
                PostRefreshTokens,
                "refresh",
                config =>
                {
                    config.WithTags(new[] { "cloudCrafterAuthTest" });
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
