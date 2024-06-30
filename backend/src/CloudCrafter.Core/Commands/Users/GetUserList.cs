using CloudCrafter.Core.Common.Responses;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Domain.Domain.User;
using CloudCrafter.Domain.Requests.Filtering;
using MediatR;

namespace CloudCrafter.Core.Commands.Users;

public static class GetUserList
{
    [Authorize]
    public record Query(BasePaginationRequest pagination) : IRequest<PaginatedList<UserDto>>;
    
    private class Handler(IUsersService service) : IRequestHandler<Query, PaginatedList<UserDto>>
    {
        public async Task<PaginatedList<UserDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            return await service.GetUsers();
        }
    }
}
