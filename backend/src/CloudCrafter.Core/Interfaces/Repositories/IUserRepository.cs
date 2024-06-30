using CloudCrafter.Core.Common.Responses;
using CloudCrafter.Domain.Domain.User;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Interfaces.Repositories;

public interface IUserRepository
{
    Task<PaginatedList<UserDto>> GetUsers();
}
