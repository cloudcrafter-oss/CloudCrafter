using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Teams;
using CloudCrafter.Domain.Constants;
using CloudCrafter.Domain.Domain.Teams;
using MediatR;

namespace CloudCrafter.Core.Commands.Teams;

[Authorize(Roles = $"{Roles.Administrator}")]
public class GetAllTeamsCommand : IRequest<List<SimpleTeamDto>> { }

internal class GetAllTeamsCommandHandler(ITeamsService service)
    : IRequestHandler<GetAllTeamsCommand, List<SimpleTeamDto>>
{
    public Task<List<SimpleTeamDto>> Handle(
        GetAllTeamsCommand request,
        CancellationToken cancellationToken
    )
    {
        return service.GetAllTeams();
    }
}
