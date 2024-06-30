using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Domain.Domain.User;

namespace CloudCrafter.Core.Services.Domain.Users;

public class UsersService : IUsersService
{
    public Task<List<UserDto>> GetUsers()
    {
        return Task.FromResult(new List<UserDto>());
    }
}
