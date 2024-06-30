using CloudCrafter.Core.Domain.Users;
using CloudCrafter.UseCases.Domain.Users.Services;

namespace CloudCrafter.Infrastructure.Domain.Users.Services;

public class UsersService : IUsersService
{
    public Task<List<UserDto>> GetUsers()
    {
        return Task.FromResult(new List<UserDto>());
    }
}
