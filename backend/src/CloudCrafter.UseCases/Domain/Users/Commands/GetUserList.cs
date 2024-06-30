using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Domain.Users;
using CloudCrafter.UseCases.Domain.Users.Services;
using MediatR;

namespace CloudCrafter.UseCases.Domain.Users.Commands;

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
