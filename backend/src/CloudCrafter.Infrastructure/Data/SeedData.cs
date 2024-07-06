using CloudCrafter.Core.ContributorAggregate;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Core.Configuration;
using CloudCrafter.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace CloudCrafter.Infrastructure.Data;

public static class SeedData
{
    public static readonly Contributor Contributor1 = new("Ardalis");
    public static readonly Contributor Contributor2 = new("Snowfrog");

    public static void Initialize(IServiceProvider serviceProvider)
    {
        var cloudCrafterConfig = serviceProvider.GetRequiredService<IOptions<CloudCrafterConfig>>();
        using (var dbContext = new AppDbContext(
                   serviceProvider.GetRequiredService<DbContextOptions<AppDbContext>>(), null, cloudCrafterConfig))
        {
            if (dbContext.Contributors.Any()) return; // DB has been seeded

            PopulateTestData(dbContext);
        }
    }

    public static void PopulateTestData(AppDbContext dbContext)
    {
        foreach (var contributor in dbContext.Contributors)
        {
            dbContext.Remove(contributor);
        }

        dbContext.SaveChanges();

        dbContext.Contributors.Add(Contributor1);
        dbContext.Contributors.Add(Contributor2);

        dbContext.SaveChanges();
    }

    public static void InitializeIdentity(IServiceProvider services)
    {
        using var dbContext = services.GetRequiredService<AppDbContext>();

        if (dbContext.Users.Any()) return;

        var userManager = services.GetRequiredService<UserManager<User>>();
        // add user
        var user = new User { UserName = "admin", Email = "admin@admin.com" };
        var result = userManager.CreateAsync(user, "P@ssw0rd!123").GetAwaiter().GetResult();

        if (!result.Succeeded)
        {
            throw new Exception("Failed to create user");
        }
    }
}
