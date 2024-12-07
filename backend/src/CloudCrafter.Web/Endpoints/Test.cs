using CloudCrafter.Agent.Models.SignalR;
using CloudCrafter.Core.Commands;
using CloudCrafter.Core.Interfaces.Domain.Agent;
using CloudCrafter.Core.Interfaces.Domain.Applications.Deployments;
using CloudCrafter.Core.SignalR;
using CloudCrafter.Web.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace CloudCrafter.Web.Endpoints;

public class Test : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this);
    }
}
