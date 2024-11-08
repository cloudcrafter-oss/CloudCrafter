using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Core.Configuration;
using CloudCrafter.Infrastructure.Data.Fakeds;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Environment = System.Environment;

namespace CloudCrafter.Infrastructure.Data;

public static class SeedData
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        var cloudCrafterConfig = serviceProvider.GetRequiredService<IOptions<CloudCrafterConfig>>();
        using (
            var dbContext = new AppDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<AppDbContext>>(),
                null,
                cloudCrafterConfig
            )
        )
        {
            var userCount = dbContext.Users.Count();

            if (userCount < 100)
            {
                PopulateUsers(dbContext);
            }

            var serverCount = dbContext.Servers.Count();

            if (serverCount == 0)
            {
                PopulateServers(dbContext);
            }

            var projectCount = dbContext.Projects.Count();

            if (projectCount == 0)
            {
                PopulateProjects(dbContext);
            }

            var applicationCount = dbContext.Stacks.Count();

            if (applicationCount == 0)
            {
                PopulateStacks(dbContext);
            }
        }
    }

    public static void PopulateStacks(AppDbContext dbContext)
    {
        var firstServer = dbContext.Servers.FirstOrDefault();

        if (firstServer is null)
        {
            throw new Exception("Seed servers first.");
        }

        var projects = dbContext.Projects.ToList();

        foreach (var project in projects)
        {
            // project should always have at least one environment

            var applications = FakerInstances
                .StackFaker(project.Environments.FirstOrDefault()!.Id)
                .RuleFor(x => x.Server, firstServer)
                .Generate(10);

            foreach (var application in applications)
            {
                dbContext.Stacks.Add(application);
            }
        }

        dbContext.SaveChanges();
    }

    public static void PopulateProjects(AppDbContext dbContext)
    {
        var projects = FakerInstances.ProjectFaker.Generate(10);
        foreach (var project in projects)
        {
            dbContext.Projects.Add(project);

            var environment = FakerInstances.EnvironmentFaker(project).Generate();

            dbContext.Environments.Add(environment);
        }

        dbContext.SaveChanges();
    }

    public static void PopulateServers(AppDbContext dbContext)
    {
        var servers = FakerInstances.ServerFaker.Generate(5);

        foreach (var server in servers)
        {
            dbContext.Servers.Add(server);
        }

        var localTestServer = new Server
        {
            SshPort = 22,
            IpAddress = "test-host",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Name = "Local Test Server",
            DockerDataDirectoryMount = "cloudcrafter_testhostdata",
            AgentSecretKey = "vHh7mZ5ntR",
            Id = Guid.Parse("ffcdd9ee-ff31-4344-a3ab-efdc9b5e44f1"),
        };

        dbContext.Servers.Add(localTestServer);

        dbContext.SaveChanges();
    }

    public static void PopulateUsers(AppDbContext dbContext)
    {
        var users = FakerInstances.UserFaker.Generate(100);
        foreach (var user in users)
        {
            dbContext.Users.Add(user);
        }

        dbContext.SaveChanges();
    }

    public static void InitializeIdentity(IServiceProvider services)
    {
        using var dbContext = services.GetRequiredService<AppDbContext>();

        if (dbContext.Users.Any())
        {
            return;
        }

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
