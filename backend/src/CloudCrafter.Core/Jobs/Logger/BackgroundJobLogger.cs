using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Logger;

public class BackgroundJobLogger(BackgroundJob job, IApplicationDbContext context, string categoryName) : ILogger
{
    public IDisposable? BeginScope<TState>(TState state) where TState : notnull
    {
        return null;
    }

    public bool IsEnabled(LogLevel logLevel)
    {
        return true;
    }

    public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception,
        Func<TState, Exception?, string> formatter)
    {
        var message = formatter(state, exception);
        var logEntry = new BackgroundJobLog
        {
            Timestamp = DateTime.UtcNow, Level = logLevel.ToString(), Message = $"[{categoryName}] {message}"
        };

        job.Logs.Add(logEntry);
        context.SaveChanges(); // Note: This might impact performance for high-frequency logging
    }
}
