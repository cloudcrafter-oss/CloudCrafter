using System.Text.Json.Serialization;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Teams;
using MediatR;

namespace CloudCrafter.Core.Commands.Teams;

[Authorize]
public record RenameTeamCommand : IRequest
{
    [JsonIgnore]
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
}

internal class RenameTeamCommandHandler(ITeamsService service) : IRequestHandler<RenameTeamCommand>
{
    public Task Handle(RenameTeamCommand request, CancellationToken cancellationToken)
    {
        return service.UpdateTeamName(request.Id, request.Name);
    }
}
