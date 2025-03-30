using CloudCrafter.Core.Common.Responses;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Domain.Common.Pagination;
using CloudCrafter.Domain.Domain.User;
using CloudCrafter.Domain.Requests.Filtering;
using MediatR;

namespace CloudCrafter.Core.Commands.Users;

[Authorize]
public record GetUserListQuery(PaginatedRequest<UserDto> Pagination)
    : IRequest<PaginatedList<UserDto>>;

public class GetUserListQueryHandler(IUsersService service)
    : IRequestHandler<GetUserListQuery, PaginatedList<UserDto>>
{
    public async Task<PaginatedList<UserDto>> Handle(
        GetUserListQuery request,
        CancellationToken cancellationToken
    )
    {
        return await service.GetUsers(request.Pagination);
    }
}
