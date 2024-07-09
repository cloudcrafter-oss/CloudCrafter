using CloudCrafter.Core.Commands;
using CloudCrafter.Web.Infrastructure;
using MediatR;

namespace CloudCrafter.Web.Endpoints;

public class Test : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapGet(GetTest);
    }

    public Task GetTest(ISender sender)
    {
        return sender.Send(new TestCommand.Query());
    }
}
