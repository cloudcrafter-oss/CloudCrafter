using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Teams;
using MediatR;

namespace CloudCrafter.Core.Commands.Teams;

[Authorize]
public record InviteUserToTeamWriteCommand : IRequest
{
    [Required]
    public required string Email { get; init; }

    [JsonIgnore]
    public required Guid TeamId { get; set; }
}

public record InviteUserBody
{
    [Required]
    public required string Email { get; init; }
}

internal class InviteUserToTeamWriteCommandHandler(ITeamsService teamsService)
    : IRequestHandler<InviteUserToTeamWriteCommand>
{
    public Task Handle(InviteUserToTeamWriteCommand request, CancellationToken cancellationToken)
    {
        return teamsService.InviteUser(request.TeamId, request.Email);
    }
}
