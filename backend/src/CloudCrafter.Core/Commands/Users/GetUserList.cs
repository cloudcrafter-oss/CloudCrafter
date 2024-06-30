using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Domain.Domain.User;
using MediatR;

namespace CloudCrafter.Core.Commands.Users;

public static class GetUserList
{
    [Authorize]
    public record Query() : IRequest<List<UserDto>>;
    
    private class Handler(IUsersService service) : IRequestHandler<Query, List<UserDto>>
    {
        public async Task<List<UserDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            return await service.GetUsers();
        }
    }
}
