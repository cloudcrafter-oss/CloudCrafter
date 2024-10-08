using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Domain.Entities;
using Hangfire.Console;
using Hangfire.Server;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Logger;

public class BackgroundJobLogger(
    BackgroundJob job,
    PerformContext? performContext,
    IApplicationDbContext context,
    string categoryName,
    ILogger<BackgroundJobLogger> logger
) : ILogger
{
    public IDisposable? BeginScope<TState>(TState state)
        where TState : notnull
    {
        return null;
    }

    public bool IsEnabled(LogLevel logLevel)
    {
        return true;
    }

    public void Log<TState>(
        LogLevel logLevel,
        EventId eventId,
        TState state,
        Exception? exception,
        Func<TState, Exception?, string> formatter
    )
    {
        var message = formatter(state, exception);
        var logEntry = new BackgroundJobLog
        {
            Timestamp = DateTime.UtcNow,
            Level = logLevel.ToString(),
            Message = $"[{categoryName}] {message}",
            Exception = exception?.ToString(),
        };

#if IN_TESTS
        System.Console.WriteLine("IN_TESTS >> " + logEntry.Message);
#endif
        logger.Log(logLevel, eventId, state, exception, formatter);

        performContext.WriteLine($"[{logLevel}] [{categoryName}] {message}");

        if (exception != null)
        {
            performContext.WriteLine($"[{logLevel}] Exception: {exception}");
        }

        job.Logs.Add(logEntry);
        context.SaveChanges(); // Note: This might impact performance for high-frequency logging
    }
}
