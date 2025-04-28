using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Teams;
using CloudCrafter.Domain.Domain.Teams;
using MediatR;

namespace CloudCrafter.Core.Commands.Teams;

[Authorize]
public record GetMyTeamsWithProjectsAndEnvironmentsCommand
    : IRequest<List<SimpleTeamWithProjectsAndEnvironmentsDto>>;

internal class GetMyTeamsWithProjectsAndEnvironmentsCommandHandler(
    ITeamsService service,
    IUser user
)
    : IRequestHandler<
        GetMyTeamsWithProjectsAndEnvironmentsCommand,
        List<SimpleTeamWithProjectsAndEnvironmentsDto>
    >
{
    public Task<List<SimpleTeamWithProjectsAndEnvironmentsDto>> Handle(
        GetMyTeamsWithProjectsAndEnvironmentsCommand request,
        CancellationToken cancellationToken
    )
    {
        if (user?.Id == null)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        return service.GetTeamsWithProjectsAndEnvironments(user.Id.Value);
    }
}
