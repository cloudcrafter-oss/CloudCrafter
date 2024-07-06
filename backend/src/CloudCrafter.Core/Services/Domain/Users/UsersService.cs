using AutoMapper;
using CloudCrafter.Core.Common.Responses;
using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Common.Pagination;
using CloudCrafter.Domain.Domain.User;

namespace CloudCrafter.Core.Services.Domain.Users;

public class UsersService(IUserRepository userRepository) : IUsersService
{
    public Task<PaginatedList<UserDto>> GetUsers(PaginatedRequest<UserDto> filter)
    {
        return userRepository.GetUsers(filter);
    }

   
}
