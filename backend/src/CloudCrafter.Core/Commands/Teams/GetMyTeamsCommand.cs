using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Domain.Teams;
using CloudCrafter.Domain.Domain.Teams;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace CloudCrafter.Core.Commands.Teams;

[Authorize]
public class GetMyTeamsCommand : IRequest<List<SimpleTeamDto>> { }

internal class GetMyTeamsCommandHandler(ITeamsService service, IUser user)
    : IRequestHandler<GetMyTeamsCommand, List<SimpleTeamDto>>
{
    public Task<List<SimpleTeamDto>> Handle(
        GetMyTeamsCommand request,
        CancellationToken cancellationToken
    )
    {
        if (user?.Id == null)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        return service.GetTeams(user.Id.Value);
    }
}
