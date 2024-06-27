﻿using System.Data.Common;
using CloudCrafter.Infrastructure.Data;
using CloudCrafter.Infrastructure.Identity;
using DotNet.Testcontainers.Builders;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Respawn;
using Testcontainers.PostgreSql;
using Xunit;

namespace CloudCrafter.FunctionalTests;

public class CustomWebApplicationFactory<TProgram> : WebApplicationFactory<TProgram>, IAsyncLifetime where TProgram : class
{
    private readonly PostgreSqlContainer _container = new PostgreSqlBuilder()
        .WithImage("postgres:latest") // You may want to change this to be the version your production db is on
        .WithDatabase("db")
        .WithUsername("postgres")
        .WithPassword("postgres")
        .WithWaitStrategy(Wait.ForUnixContainer().UntilCommandIsCompleted("pg_isready"))
        .WithCleanUp(true)
        .Build();

    private DbConnection _connection = null!;
    private Respawner _respawner = null!;

    /// <summary>
    /// Overriding CreateHost to avoid creating a separate ServiceProvider per this thread:
    /// https://github.com/dotnet-architecture/eShopOnWeb/issues/465
    /// </summary>
    /// <param name="builder"></param>
    /// <returns></returns>
    protected override IHost CreateHost(IHostBuilder builder)
    {
        builder.UseEnvironment("Development"); // will not send real emails
        var host = builder.Build();
        host.Start();

        // Get service provider. 
        var serviceProvider = host.Services;

        // Create a scope to obtain a reference to the database
        // context (AppDbContext).
        // using (var scope = serviceProvider.CreateScope())
        // {
        //     var scopedServices = scope.ServiceProvider;
        //     var db = scopedServices.GetRequiredService<AppDbContext>();
        //
        //     var logger = scopedServices
        //         .GetRequiredService<ILogger<CustomWebApplicationFactory<TProgram>>>();
        //
        //     // Reset Sqlite database for each test run
        //     // If using a real database, you'll likely want to remove this step.
        //     db.Database.EnsureDeleted();
        //
        //     // Ensure the database is created.
        //     db.Database.EnsureCreated();
        //
        //     try
        //     {
        //         // Can also skip creating the items
        //         //if (!db.ToDoItems.Any())
        //         //{
        //         // Seed the database with test data.
        //         SeedData.PopulateTestData(db);
        //         //}
        //     }
        //     catch (Exception ex)
        //     {
        //         logger.LogError(ex, "An error occurred seeding the " +
        //                             "database with test messages. Error: {exceptionMessage}", ex.Message);
        //     }
        // }

        return host;
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder
            .ConfigureServices(services =>
            {
                // Configure test dependencies here
                services.RemoveDbContext<AppDbContext>();
                services.RemoveDbContext<AppIdentityDbContext>();


                var connString = _container.GetConnectionString();

                services.AddDbContext<AppDbContext>(options =>
                {
                    options.UseNpgsql(_container.GetConnectionString());
                });
                
                services.AddDbContext<AppIdentityDbContext>(options =>
                {
                    options.UseNpgsql(_container.GetConnectionString());
                });
                
                services.EnsureDbCreated<AppDbContext>();
                services.EnsureDbCreated<AppIdentityDbContext>();
                //// Remove the app's ApplicationDbContext registration.
                //var descriptor = services.SingleOrDefault(
                //d => d.ServiceType ==
                //    typeof(DbContextOptions<AppDbContext>));

                //if (descriptor != null)
                //{
                //  services.Remove(descriptor);
                //}

                //// This should be set for each individual test run
                //string inMemoryCollectionName = Guid.NewGuid().ToString();

                //// Add ApplicationDbContext using an in-memory database for testing.
                //services.AddDbContext<AppDbContext>(options =>
                //{
                //  options.UseInMemoryDatabase(inMemoryCollectionName);
                //});
            });
    }

    public async Task InitializeAsync()
    {
        await _container.StartAsync();

        Db = Services.CreateScope().ServiceProvider.GetRequiredService<AppDbContext>();
        _connection = Db.Database.GetDbConnection();
        await _connection.OpenAsync();

        _respawner = await Respawner.CreateAsync(_connection, new RespawnerOptions
        {
            DbAdapter = DbAdapter.Postgres,
            SchemasToInclude = new[] { "public" }
        });
    }

    public AppDbContext Db { get; set; } = null!;

    public async Task ResetDatabase()
    {
        await _respawner.ResetAsync(_connection);
    }
    
    public new async Task DisposeAsync()
    {
        await _connection.CloseAsync();
        await _container.DisposeAsync();
    }
}


public static class ServiceCollectionExtensions
{
    public static void RemoveDbContext<T>(this IServiceCollection services) where T : DbContext
    {
        var descriptor = services.SingleOrDefault(x => x.ServiceType == typeof(DbContextOptions<T>));
        if (descriptor != null)
        {
            services.Remove(descriptor);
        }
    }

    public static void EnsureDbCreated<T>(this IServiceCollection services) where T : DbContext
    {
        using var scope = services.BuildServiceProvider().CreateScope();
        var serviceProvider = scope.ServiceProvider;
        var context = serviceProvider.GetRequiredService<T>();
        context.Database.Migrate();
    }
}
