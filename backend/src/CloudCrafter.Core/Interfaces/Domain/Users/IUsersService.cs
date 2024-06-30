
using CloudCrafter.Domain.Domain.User;

namespace CloudCrafter.Core.Interfaces.Domain.Users;

public interface IUsersService
{
    Task<List<UserDto>> GetUsers();
}
