using CloudCrafter.Core.Domain.Auth;
using CloudCrafter.UseCases.Domain.Auth.Commands;
using CloudCrafter.Web.Infrastructure;
using MediatR;

namespace CloudCrafter.Web.Endpoints;

public class Auth : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapPost(PostLoginUser);
    }

    public async Task<TokenDto> PostLoginUser(ISender sender, PostLoginUser.Query query)
    {
        return await sender.Send(query);
    }
}
