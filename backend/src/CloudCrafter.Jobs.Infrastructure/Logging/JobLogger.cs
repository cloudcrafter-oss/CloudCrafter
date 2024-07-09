using Microsoft.Extensions.Logging;

namespace CloudCrafter.Jobs.Infrastructure.Logging;

public class JobLogger : ILogger
{
    private readonly string _deploymentId;
    private List<string> _logs = new List<string>();

    public JobLogger(string deploymentId)
    {
        _deploymentId = deploymentId;
    }


    public IDisposable? BeginScope<TState>(TState state) where TState : notnull
    {
        return null;
    }

    public bool IsEnabled(LogLevel logLevel) => true;
    public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
    {
        var message = formatter(state, exception);
        _logs.Add($"[{_deploymentId}] {message}");
    }

    // public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
    // {
    //     var message = formatter(state, exception);
    //     _logs.Add($"[{_deploymentId}] {message}");
    // }

    public IEnumerable<string> GetLogs() => _logs;
}
