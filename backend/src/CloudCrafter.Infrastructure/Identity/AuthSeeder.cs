using CloudCrafter.Domain.Constants;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Identity;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Infrastructure.Identity;

public class AuthSeeder(RoleManager<Role> roleManager)
{
    public async Task SeedRolesAsync()
    {
        var administratorRole = new Role(Roles.Administrator);

        if (roleManager.Roles.All(r => r.Name != administratorRole.Name))
        {
            await roleManager.CreateAsync(administratorRole);
        }

        var userRole = new Role(Roles.User);
        if (roleManager.Roles.All(r => r.Name != userRole.Name))
        {
            await roleManager.CreateAsync(userRole);
        }
    }
}
