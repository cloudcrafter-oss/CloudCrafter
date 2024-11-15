using System.Data.Common;
using System.Linq.Expressions;
using CloudCrafter.Domain.Entities;
using CloudCrafter.FunctionalTests.Database;
using CloudCrafter.Infrastructure.Data;
using CloudCrafter.Infrastructure.Data.Fakeds;
using CloudCrafter.Infrastructure.Logging;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;
using Serilog;
using Environment = System.Environment;

namespace CloudCrafter.FunctionalTestWithMocks;

public abstract class BaseReplaceTest
{
    private ITestDatabase _database;
    private IServiceScopeFactory _scopeFactory;
    public Guid? _userId;

    public abstract Task<CustomWebApplicationFactory> CustomSetup(
        DbConnection postgreSqlConnection,
        string redisConnectionString
    );

    [OneTimeSetUp]
    public async Task OneTimeSetUp()
    {
        Log.Logger = LoggingConfiguration.GetLogger();
        _database = await TestDatabaseFactory.CreateAsync();
        var factory = await CustomSetup(
            _database.GetConnection(),
            _database.GetRedisConnectionString()
        );
        _scopeFactory = factory.Services.GetRequiredService<IServiceScopeFactory>();
    }

    [SetUp]
    public async Task TestSetUp()
    {
        await ResetState();
    }

    public async Task ResetState()
    {
        await _database.ResetAsync();
        _userId = null;
    }

    public async Task<TResponse> SendAsync<TResponse>(IRequest<TResponse> request)
    {
        using var scope = _scopeFactory.CreateScope();

        var mediator = scope.ServiceProvider.GetRequiredService<ISender>();

        return await mediator.Send(request);
    }

    public async Task<Guid?> RunAsAdministratorAsync()
    {
        return await RunAsUserAsync(
            "administrator@local",
            "Administrator1234!",
            Array.Empty<string>()
        );
    }

    public async Task<Guid?> RunAsUserAsync(string userName, string password, string[] roles)
    {
        using var scope = _scopeFactory.CreateScope();

        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

        var user = new User { UserName = userName, Email = userName };

        var result = await userManager.CreateAsync(user, password);

        if (roles.Any())
        {
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }

            await userManager.AddToRolesAsync(user, roles);
        }

        if (result.Succeeded)
        {
            _userId = user.Id;

            return _userId;
        }

        var errors = string.Join(Environment.NewLine, result.Errors);

        throw new Exception($"Unable to create {userName}.{Environment.NewLine}{errors}");
    }

    public async Task AddAsync<TEntity>(TEntity entity)
        where TEntity : class
    {
        using var scope = _scopeFactory.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        context.Add(entity);

        await context.SaveChangesAsync();
    }

    public async Task<int> CountAsync<TEntity>()
        where TEntity : class
    {
        using var scope = _scopeFactory.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        return await context.Set<TEntity>().CountAsync();
    }

    public async Task<List<TEntity>> QueryAsync<TEntity>(Expression<Func<TEntity, bool>> predicate)
        where TEntity : class
    {
        using var scope = _scopeFactory.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        return await context.Set<TEntity>().Where(predicate).ToListAsync();
    }

    public async Task<TEntity?> QueryFirstOrDefaultAsync<TEntity>(
        Expression<Func<TEntity, bool>> predicate
    )
        where TEntity : class
    {
        using var scope = _scopeFactory.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        return await context.Set<TEntity>().FirstOrDefaultAsync(predicate);
    }

    public async Task<Stack> CreateSampleStack()
    {
        var server = FakerInstances.ServerFaker.Generate();
        await AddAsync(server);

        var project = FakerInstances.ProjectFaker.Generate();
        await AddAsync(project);

        var environment = FakerInstances.EnvironmentFaker(project).Generate();
        await AddAsync(environment);

        var stack = FakerInstances
            .StackFaker(environment.Id)
            .RuleFor(x => x.ServerId, server.Id)
            .Generate();
        await AddAsync(stack);

        return stack;
    }
}
