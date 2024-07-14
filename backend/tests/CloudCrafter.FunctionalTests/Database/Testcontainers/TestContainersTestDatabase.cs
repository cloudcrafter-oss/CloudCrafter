using System.Data.Common;
using Ardalis.SharedKernel;
using CloudCrafter.Infrastructure.Core.Configuration;
using CloudCrafter.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Npgsql;
using NSubstitute;
using Respawn;
using Respawn.Graph;
using Testcontainers.PostgreSql;
using Testcontainers.Redis;

namespace CloudCrafter.FunctionalTests.Database.Testcontainers;

public class TestContainersTestDatabase : ITestDatabase
{
    private readonly PostgreSqlContainer _postgreSqlContainer;
    private readonly RedisContainer _redisContainer;
    private DbConnection _connection = null!;
    private string _connectionString = null!;
    private Respawner _respawner = null!;

    public TestContainersTestDatabase()
    {
        _postgreSqlContainer = new PostgreSqlBuilder().WithUsername("postgres")
            .WithPassword("password").Build();
        _redisContainer = new RedisBuilder()
            .WithImage("redis:alpine")
            .Build();
    }

    public async Task InitialiseAsync()
    {
        await _postgreSqlContainer.StartAsync();
        await _redisContainer.StartAsync();

        _connectionString = _postgreSqlContainer.GetConnectionString();

        _connection = new NpgsqlConnection(_connectionString);
        await _connection.OpenAsync();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseNpgsql(_connectionString)
            .Options;

        var _fakeEventDispatcher = Substitute.For<IDomainEventDispatcher>();


        // inject IOptions<CloudCrafterConfig> into AppDbContext
        var cloudCrafterOptions = Options.Create(new CloudCrafterConfig
        {
            AppKey = "this-is-some-dummy-testing-value"
        });

        var context = new AppDbContext(options, _fakeEventDispatcher, cloudCrafterOptions);

        context.Database.Migrate();

        _respawner = await Respawner.CreateAsync(_connection,
            new RespawnerOptions
            {
                DbAdapter = DbAdapter.Postgres, TablesToIgnore = new Table[] { "__EFMigrationsHistory" }
            });
    }

    public DbConnection GetConnection()
    {
        return _connection;
    }

    public string GetRedisConnectionString()
    {
        return _redisContainer.GetConnectionString();
    }

    public async Task ResetAsync()
    {
        await _respawner.ResetAsync(_connection);
    }

    public async Task DisposeAsync()
    {
        await _connection.DisposeAsync();
        await _postgreSqlContainer.DisposeAsync();
        await _redisContainer.DisposeAsync();
    }
}
