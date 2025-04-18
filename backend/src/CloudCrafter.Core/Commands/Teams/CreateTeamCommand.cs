using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Teams;
using MediatR;

namespace CloudCrafter.Core.Commands.Teams;

[Authorize]
public record CreateTeamCommand(string Name) : IRequest<Guid>;

internal class CreateTeamCommandHandler(ITeamsService service, IUser currentUser)
    : IRequestHandler<CreateTeamCommand, Guid>
{
    public Task<Guid> Handle(CreateTeamCommand request, CancellationToken cancellationToken)
    {
        if (currentUser?.Id == null)
        {
            // This should never happen due to the Authorize attribute
            throw new UnauthorizedAccessException("User is not logged in.");
        }

        return service.CreateTeam(request.Name, currentUser.Id.Value);
    }
}
