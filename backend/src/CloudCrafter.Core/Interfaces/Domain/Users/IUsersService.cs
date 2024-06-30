
using CloudCrafter.Core.Common.Responses;
using CloudCrafter.Domain.Domain.User;

namespace CloudCrafter.Core.Interfaces.Domain.Users;

public interface IUsersService
{
    Task<PaginatedList<UserDto>> GetUsers();
}
