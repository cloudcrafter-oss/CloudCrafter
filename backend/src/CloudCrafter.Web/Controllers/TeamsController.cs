using CloudCrafter.Core.Commands.Teams;
using CloudCrafter.Domain.Domain.Teams;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CloudCrafter.Web.Controllers;

public class TeamsController : CloudCrafterController
{
    [HttpGet]
    public Task<List<SimpleTeamDto>> GetMyTeams(ISender sender)
    {
        return sender.Send(new GetMyTeamsCommand());
    }

    [HttpGet("all")]
    public Task<List<SimpleTeamDto>> GetAllTeams(ISender sender)
    {
        return sender.Send(new GetAllTeamsCommand());
    }

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

    [HttpDelete("{teamId:guid}")]
    public Task DeleteTeam([FromRoute] Guid teamId, ISender sender)
    {
        return sender.Send(new DeleteTeamCommand(teamId));
    }
}
