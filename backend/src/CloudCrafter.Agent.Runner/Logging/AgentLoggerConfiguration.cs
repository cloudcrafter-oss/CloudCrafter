using Serilog;
using Serilog.Sinks.SystemConsole.Themes;

namespace CloudCrafter.Agent.Runner.Logging;

public class AgentLoggerConfiguration
{
    public static LoggerConfiguration CreateConfiguration()
    {
        return new LoggerConfiguration()
            .WriteTo.Console(theme: AnsiConsoleTheme.Sixteen)
            .MinimumLevel.Debug();
    }
}
