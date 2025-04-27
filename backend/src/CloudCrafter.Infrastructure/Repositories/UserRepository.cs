using AutoMapper;
using AutoMapper.QueryableExtensions;
using CloudCrafter.Core.Common.Responses;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Common.Pagination;
using CloudCrafter.Domain.Domain.User;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Common.Helpers;
using CloudCrafter.Infrastructure.Data;
using CloudCrafter.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Infrastructure.Repositories;

public class UserRepository(AppDbContext context, IMapper mapper) : IUserRepository
{
    private IQueryable<User> GetBaseQuery()
    {
        return context.Users.OrderBy(x => x.Email);
    }

    public async Task<PaginatedList<UserDto>> GetUsers(PaginatedRequest filter)
    {
        var users = GetBaseQuery().AsQueryable();

        var result = await users.ToPaginatedListAsync<User, UserDto>(filter, mapper);

        return result;
    }

    public Task<User?> GetUserByEmail(string email)
    {
        return GetBaseQuery().Where(x => x.Email == email).FirstOrDefaultAsync();
    }
}
