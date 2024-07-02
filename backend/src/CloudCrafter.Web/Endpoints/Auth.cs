using CloudCrafter.Core.Commands.Auth;
using CloudCrafter.Domain.Domain.Auth;
using CloudCrafter.Web.Infrastructure;
using MediatR;
using Microsoft.OpenApi.Models;

namespace CloudCrafter.Web.Endpoints;

public class Auth : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapPost(PostLoginUser, "login")
            .MapPost(PostCreateUser, "create");
    }

    public async Task<TokenDto> PostLoginUser(ISender sender, PostLoginUser.Query query)
    {
        return await sender.Send(query);
    }

    public async Task<TokenDto> PostCreateUser(ISender sender, PostCreateUser.Query query)
    {
        return await sender.Send(query);
    }
}
