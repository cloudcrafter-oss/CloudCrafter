using System.Data.Common;
using Ardalis.GuardClauses;
using Ardalis.SharedKernel;
using CloudCrafter.Infrastructure.Core.Configuration;
using CloudCrafter.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Npgsql;
using NSubstitute;
using Respawn;
using Respawn.Graph;

namespace CloudCrafter.FunctionalTests.Database.Dev;

public class DevelopmentTestDatabase : ITestDatabase
{
    private readonly string _connectionString = null!;
    private readonly string _redisConnectionString;
    private NpgsqlConnection _connection = null!;
    private Respawner _respawner = null!;

    public DevelopmentTestDatabase()
    {
        var config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.Development.json")
            .AddEnvironmentVariables()
            .Build();

        var connectionString = config.GetConnectionString("PostgresConnectionTesting");
        Guard.Against.Null(connectionString);

        _connectionString = connectionString;

        var redisConnection = config.GetConnectionString("RedisConnectionTesting");
        Guard.Against.Null(redisConnection);

        _redisConnectionString = redisConnection;
    }

    public async Task InitialiseAsync()
    {
        _connection = new NpgsqlConnection(_connectionString);
        await _connection.OpenAsync();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseNpgsql(_connectionString)
            .Options;

        // TODO: Not sure if we want to fake this... perhaps we need it
        // in the future.
        var _fakeEventDispatcher = Substitute.For<IDomainEventDispatcher>();

        // inject IOptions<CloudCrafterConfig> into AppDbContext
        var cloudCrafterOptions = Options.Create(
            new CloudCrafterConfig { AppKey = "this-is-some-dummy-testing-value" }
        );

        var context = new AppDbContext(options, _fakeEventDispatcher, cloudCrafterOptions);
        await context.Database.MigrateAsync();
        _respawner = await Respawner.CreateAsync(
            _connection,
            new RespawnerOptions
            {
                DbAdapter = DbAdapter.Postgres,
                TablesToIgnore = new Table[] { "__EFMigrationsHistory", "StackServiceTypes" },
            }
        );
    }

    public DbConnection GetConnection()
    {
        return _connection;
    }

    public string GetRedisConnectionString()
    {
        return _redisConnectionString;
    }

    public async Task ResetAsync()
    {
        await _respawner.ResetAsync(_connection);
    }

    public async Task DisposeAsync()
    {
        await _connection.DisposeAsync();
    }
}
