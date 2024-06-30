using AutoMapper;
using AutoMapper.QueryableExtensions;
using CloudCrafter.Core.Common.Responses;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.User;
using CloudCrafter.Infrastructure.Common.Helpers;
using CloudCrafter.Infrastructure.Data;
using CloudCrafter.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Infrastructure.Repositories;

public class UserRepository(AppDbContext context, IMapper mapper) : IUserRepository
{
    public async Task<PaginatedList<UserDto>> GetUsers()
    {
        var users = await context.Users
            .Skip(0).Take(10)
            .ProjectTo<UserDto>(mapper.ConfigurationProvider)
            .ToPaginatedListAsync(1, 10);

        return users;
    }
}
