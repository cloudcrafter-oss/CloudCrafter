﻿using CloudCrafter.Core.ContributorAggregate;
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

        }
    }

    public static void PopulateProjects(AppDbContext dbContext)
    {
        var projects = Fakeds.FakerInstances.ProjectFaker.Generate(10);
        foreach (var project in projects)
        {
            dbContext.Projects.Add(project);
        }

        dbContext.SaveChanges();
    }

    public static void PopulateServers(AppDbContext dbContext)
    {
        var servers = Fakeds.FakerInstances.ServerFaker.Generate(5);
        foreach (var server in servers)
        {
            dbContext.Servers.Add(server);
        }

        dbContext.SaveChanges();
    }

    public static void PopulateUsers(AppDbContext dbContext)
    {
        var users = Fakeds.FakerInstances.UserFaker.Generate(100);
        foreach (var user in users)
        {
            dbContext.Users.Add(user);
        }
        
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
