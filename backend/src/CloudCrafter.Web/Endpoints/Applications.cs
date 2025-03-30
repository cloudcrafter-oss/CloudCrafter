using CloudCrafter.Core.Commands.Applications.Deployments;
using CloudCrafter.Web.Infrastructure;
using MediatR;

namespace CloudCrafter.Web.Endpoints;

public class Applications : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this).MapPost(PostCreateDeployment, "{applicationId}/deployment");
    }

    public Task PostCreateDeployment(ISender sender, Guid applicationId)
    {
        return sender.Send(new CreateDeploymentCommand(applicationId));
    }
}
