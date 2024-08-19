using System.CommandLine;
using CloudCrafter.Jobs.Service;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace CloudCrafter.Worker.Console;

public class Program
{
    public static async Task<int> Main(string[] args)
    {
        return await RunApp(args);
    }

    public static async Task<int> RunApp(string[] args)
    {
        var host = CreateHostBuilder(args).Build();

        
        await host.RunAsync();
        return 0;
    }
    
    
    public static IHostBuilder CreateHostBuilder(string[] args)
    {
        Log.Logger = new LoggerConfiguration()
            .WriteTo.Console()
            .CreateLogger();


        var builder = Host.CreateDefaultBuilder(args);

        var configurationBuilder = new ConfigurationBuilder();
        configurationBuilder.AddJsonFile("appsettings.json", optional: true);
        configurationBuilder.AddJsonFile("appsettings.Development.json", optional: true);
        configurationBuilder.AddEnvironmentVariables();

        var config = configurationBuilder.Build();
        
        var manager = new ConfigurationManager();
        manager.AddConfiguration(config);
        
        
        return builder
            .ConfigureServices((hostContext, services) =>
            {
                services.AddMediatR(cfg =>
                {
                    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
                });
                
                services.AddJobInfrastructure(manager, withServer: true, "worker");

                services.AddSerilog();
            });
    }
}
