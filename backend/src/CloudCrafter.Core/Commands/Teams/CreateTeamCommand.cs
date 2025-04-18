using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Teams;
using MediatR;

namespace CloudCrafter.Core.Commands.Teams;

[Authorize]
public record CreateTeamCommand(string Name) : IRequest<Guid>;

internal class CreateTeamCommandHandler(ITeamsService service)
    : IRequestHandler<CreateTeamCommand, Guid>
{
    public Task<Guid> Handle(CreateTeamCommand request, CancellationToken cancellationToken)
    {
        return service.CreateTeam(request.Name);
    }
}
