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

        IEnumerable<string>? privateKeyEntry = null;

        try
        {
            var solutionDirectory = GetSolutionDirectory();

            var dockerfileDirectory = Path.Combine(solutionDirectory, "..", "docker", "test-host");

            privateKeyEntry = File.ReadLines(dockerfileDirectory + "/id_rsa");
        }
        catch (DirectoryNotFoundException)
        {
            var path = Environment.GetEnvironmentVariable("SPECIAL_TESTHOST_PATH");

            if (string.IsNullOrEmpty(path))
            {
                throw new Exception("Private key file not found");
            }

            privateKeyEntry = File.ReadLines(path);
        }

        var sshKey = string.Join("\n", privateKeyEntry);

        var localTestServer = new Server
        {
            SshPort = 22,
            SshUsername = "root",
            SshPrivateKey = sshKey,
            IpAddress = "test-host",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Name = "Local Test Server",
            DockerDataDirectoryMount = "cloudcrafter_testhostdata",
            Id = Guid.NewGuid(),
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

    private static string GetSolutionDirectory()
    {
        var directory = new DirectoryInfo(Directory.GetCurrentDirectory());
        while (directory != null && !directory.GetFiles("*.sln").Any())
        {
            directory = directory.Parent;
        }

        return directory?.FullName
            ?? throw new DirectoryNotFoundException("Solution directory not found.");
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
