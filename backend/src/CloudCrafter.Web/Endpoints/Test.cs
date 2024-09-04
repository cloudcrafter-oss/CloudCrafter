using CloudCrafter.Core.Commands;
using CloudCrafter.Core.Jobs;
using CloudCrafter.Web.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CloudCrafter.Web.Endpoints;

public class Test : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapPost(GetTest);
    }

    public Task GetTest(ISender sender, [FromBody] TestCommand.Query query)
    {
        return Task.CompletedTask;
    }
}
