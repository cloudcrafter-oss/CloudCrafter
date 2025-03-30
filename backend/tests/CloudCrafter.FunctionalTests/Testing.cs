using System.Linq.Expressions;
using Bogus;
using CloudCrafter.Domain.Entities;
using CloudCrafter.FunctionalTests.Database;
using CloudCrafter.FunctionalTests.TestModels;
using CloudCrafter.Infrastructure.Data;
using CloudCrafter.Infrastructure.Data.Fakeds;
using CloudCrafter.Infrastructure.Logging;
using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;
using Serilog;
using Environment = System.Environment;

namespace CloudCrafter.FunctionalTests;

[SetUpFixture]
public class Testing
{
    private static ITestDatabase _database = null!;
    public static CustomWebApplicationFactory _factory = null!;
    private static IServiceScopeFactory _scopeFactory = null!;
    private static Guid? _userId;

    [OneTimeSetUp]
    public async Task RunBeforeAnyTests()
    {
        Log.Logger = LoggingConfiguration.GetLogger();
        _database = await TestDatabaseFactory.CreateAsync();

        _factory = new CustomWebApplicationFactory(
            _database.GetConnection(),
            _database.GetRedisConnectionString()
        );

        _scopeFactory = _factory.Services.GetRequiredService<IServiceScopeFactory>();
    }

    public static string GetDockerfileDirectory()
    {
        var solutionDirectory = GetSolutionDirectory();
        var dockerfileDirectory = Path.Combine(solutionDirectory, "..", "docker", "test-host");
        return dockerfileDirectory;
    }

    public static async Task<TResponse> SendAsync<TResponse>(IRequest<TResponse> request)
    {
        using var scope = _scopeFactory.CreateScope();

        var mediator = scope.ServiceProvider.GetRequiredService<ISender>();

        return await mediator.Send(request);
    }

    public static TService GetService<TService>()
        where TService : notnull
    {
        var scope = _scopeFactory.CreateScope();

        return scope.ServiceProvider.GetRequiredService<TService>();
    }

    public static T? FetchEntity<T>(
        Expression<Func<T, bool>> expression,
        Func<IQueryable<T>, IQueryable<T>>? includeFunc = null
    )
        where T : class
    {
        using var scope = _scopeFactory.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        IQueryable<T> query = context.Set<T>();

        if (includeFunc != null)
        {
            query = includeFunc(query);
        }

        return query.FirstOrDefault(expression);
    }

    public static List<T> FetchEntityList<T>(
        Expression<Func<T, bool>> expression,
        Func<IQueryable<T>, IQueryable<T>>? includeFunc = null
    )
        where T : class
    {
        using var scope = _scopeFactory.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        IQueryable<T> query = context.Set<T>();

        if (includeFunc != null)
        {
            query = includeFunc(query);
        }

        return query.Where(expression).ToList();
    }

    public static async Task<UsernamePasswordDto> CreateAdminUser()
    {
        using var scope = _scopeFactory.CreateScope();

        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

        var userFaker = FakerInstances.UserFaker.Generate();

        var faker = new Faker();
        var password =
            "AcdE3" + faker.Internet.Password(16) + faker.Random.String2(3, "!@#$%^&*()_+");

        var result = await userManager.CreateAsync(userFaker, password);

        if (!result.Succeeded)
        {
            throw new Exception(
                $"Unable to create {userFaker.UserName}, error: {string.Join(", ", result.Errors.Select(x => x.Description))}"
            );
        }

        return new UsernamePasswordDto(userFaker.Email!, password);
    }

    public static async Task SendAsync(IBaseRequest request)
    {
        using var scope = _scopeFactory.CreateScope();

        var mediator = scope.ServiceProvider.GetRequiredService<ISender>();

        await mediator.Send(request);
    }

    public static Guid? GetUserId()
    {
        return _userId;
    }

    public static async Task<Guid?> RunAsDefaultUserAsync()
    {
        return await RunAsUserAsync("test@local", "Testing1234!", Array.Empty<string>());
    }

    public static async Task<Guid?> RunAsAdministratorAsync()
    {
        return await RunAsUserAsync(
            "administrator@local",
            "Administrator1234!",
            Array.Empty<string>()
        );
    }

    public static async Task<Guid?> RunAsUserAsync(string userName, string password, string[] roles)
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

    public static async Task ResetState()
    {
        await _database.ResetAsync();
        _userId = null;
    }

    public static async Task<TEntity?> FindAsync<TEntity>(params object[] keyValues)
        where TEntity : class
    {
        using var scope = _scopeFactory.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        return await context.FindAsync<TEntity>(keyValues);
    }

    public static async Task AddAsync<TEntity>(TEntity entity)
        where TEntity : class
    {
        using var scope = _scopeFactory.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        context.Add(entity);

        await context.SaveChangesAsync();
    }

    public static async Task<int> CountAsync<TEntity>()
        where TEntity : class
    {
        using var scope = _scopeFactory.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        return await context.Set<TEntity>().CountAsync();
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

    [OneTimeTearDown]
    public async Task RunAfterAnyTests()
    {
        await _database.DisposeAsync();
        await _factory.DisposeAsync();
    }
}
