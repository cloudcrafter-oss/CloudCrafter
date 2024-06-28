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

    public async Task<Dummy> GetDummy(ISender sender, PostLoginUser.Query query)
    {
        await sender.Send(query);

        return new Dummy() { Title = "hallo" };
    }
}

public class Dummy
{
    public string Title { get; init; } = null!;
}
