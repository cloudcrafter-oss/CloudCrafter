using CloudCrafter.Core.Commands.Teams;
using CloudCrafter.Core.Common.Responses;
using CloudCrafter.Domain.Common.Pagination;
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

    [HttpGet("{teamId:guid}")]
    public Task<PaginatedList<TeamMemberDto>> GetTeamMembers(
        ISender sender,
        Guid teamId,
        [FromQuery] PaginatedRequest paginatedRequest
    )
    {
        return sender.Send(new GetTeamUsersCommand(teamId, paginatedRequest));
    }

    [HttpPost("{teamId:guid}/invite")]
    public async Task<IActionResult> InviteUserToTeam(
        [FromRoute] Guid teamId,
        [FromBody] InviteUserBody body,
        ISender sender
    )
    {
        await sender.Send(new InviteUserToTeamWriteCommand { Email = body.Email, TeamId = teamId });

        return Ok();
    }

    [HttpGet("projects-and-environments")]
    public async Task<
        List<SimpleTeamWithProjectsAndEnvironmentsDto>
    > GetMyTeamsWithProjectsAndEnvironments(ISender sender)
    {
        return await sender.Send(new GetMyTeamsWithProjectsAndEnvironmentsCommand());
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
