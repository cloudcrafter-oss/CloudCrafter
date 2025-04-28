using CloudCrafter.Core.Common.Responses;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Teams;
using CloudCrafter.Domain.Common.Pagination;
using CloudCrafter.Domain.Domain.Teams;
using MediatR;

namespace CloudCrafter.Core.Commands.Teams;

[Authorize]
public record GetTeamUsersCommand(Guid TeamId, PaginatedRequest Pagination)
    : IRequest<PaginatedList<TeamMemberDto>>;

internal class GetTeamUsersCommandHandler(ITeamsService teamsService)
    : IRequestHandler<GetTeamUsersCommand, PaginatedList<TeamMemberDto>>
{
    public Task<PaginatedList<TeamMemberDto>> Handle(
        GetTeamUsersCommand request,
        CancellationToken cancellationToken
    )
    {
        return teamsService.GetTeamMembers(request.TeamId, request.Pagination);
    }
}
