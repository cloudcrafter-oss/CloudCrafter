using CloudCrafter.Agent.Runner;
using CloudCrafter.Agent.Runner.Hosts;
using CloudCrafter.Agent.Runner.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Serilog;

namespace CloudCrafter.Agent.Console;

public class Program
{
    public static async Task<int> Main(string[] args)
    {
        Log.Logger = AgentLoggerConfiguration.CreateConfiguration().CreateLogger();

        var host = CreateHostBuilder(args).Build();

        var logger = host.Services.GetRequiredService<ILogger<Program>>();

        var validator = host.Services.GetRequiredService<IStartupValidator>();
        validator.Validate();

        await host.StartAsync();

        var manager = host.Services.GetRequiredService<SocketManager>();

        try
        {
            await manager.ConnectAsync();
        }
        catch (Exception ex)
        {
            logger.LogCritical(ex, "Something went wrong, exiting...");
            return 1;
        }

        return 0;
    }

    public static IHostBuilder CreateHostBuilder(string[] args)
    {
        return BaseHostCreator.CreateBuilder(args, typeof(Program).Assembly);
    }
}
