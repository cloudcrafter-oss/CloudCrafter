using CloudCrafter.Core.Commands.Teams;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CloudCrafter.Web.Controllers;

public class TeamsController : CloudCrafterController
{
    [HttpPost]
    public Task<Guid> CreateTeam(ISender sender, CreateTeamCommand request)
    {
        return sender.Send(request);
    }

    [HttpPut("{teamId:guid}")]
    public Task RenameTeam(
        [FromRoute] Guid teamId,
        [FromBody] RenameTeamCommand request,
        ISender sender
    )
    {
        return sender.Send(request with { Id = teamId });
    }
}
