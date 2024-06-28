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
            .MapPost(GetDummy);
    }

    public async Task<TokenDto> GetDummy(ISender sender, PostLoginUser.Query query)
    {
        return await sender.Send(query);
    }
}

public class Dummy
{
    public string Title { get; init; } = null!;
}
