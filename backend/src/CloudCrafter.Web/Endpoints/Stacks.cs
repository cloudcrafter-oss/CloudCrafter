using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Domain.Domain.Stack;
using CloudCrafter.Web.Infrastructure;
using MediatR;

namespace CloudCrafter.Web.Endpoints;

public class Stacks : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapPost(PostCreateStack);
    }

    public async Task<StackCreatedDto> PostCreateStack(CreateStackCommand.Command command, ISender sender)
    {
        return await sender.Send(command);
    }
}
