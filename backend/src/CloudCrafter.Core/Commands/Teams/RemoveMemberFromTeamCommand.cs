using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Teams;
using MediatR;

namespace CloudCrafter.Core.Commands.Teams;

[Authorize]
public record RemoveMemberFromTeamCommand : IRequest
{
    public required string Email { get; init; }

    [JsonIgnore]
    public Guid TeamId { get; set; }
}

public record RemoveMemberBody
{
    [Required]
    public required string Email { get; init; }
}

internal class RemoveMemberFromTeamCommandHandler(ITeamsService teamAccessService)
    : IRequestHandler<RemoveMemberFromTeamCommand>
{
    public async Task Handle(
        RemoveMemberFromTeamCommand request,
        CancellationToken cancellationToken
    )
    {
        await teamAccessService.RemoveUserFromTeam(request.TeamId, request.Email);
    }
}
