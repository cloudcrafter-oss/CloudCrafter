using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Teams;
using MediatR;

namespace CloudCrafter.Core.Commands.Teams;

[Authorize]
public record DeleteTeamCommand(Guid TeamId) : IRequest;

internal class DeleteTeamCommandHandler(ITeamsService service) : IRequestHandler<DeleteTeamCommand>
{
    public Task Handle(DeleteTeamCommand request, CancellationToken cancellationToken)
    {
        return service.DeleteTeam(request.TeamId);
    }
}
