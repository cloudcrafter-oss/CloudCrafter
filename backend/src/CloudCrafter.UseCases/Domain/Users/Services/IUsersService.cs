using CloudCrafter.Core.Domain.Users;

namespace CloudCrafter.UseCases.Domain.Users.Services;

public interface IUsersService
{
    Task<List<UserDto>> GetUsers();
}
