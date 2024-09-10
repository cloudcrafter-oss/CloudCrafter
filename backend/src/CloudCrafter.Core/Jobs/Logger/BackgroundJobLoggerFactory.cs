using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Domain.Entities;
using Hangfire.Server;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Logger;

public class BackgroundJobLoggerFactory(
    BackgroundJob job,
    PerformContext? performContext,
    IApplicationDbContext context,
    IServiceProvider sp
) : ILoggerFactory
{
    public void AddProvider(ILoggerProvider provider) { }

    public ILogger CreateLogger(string categoryName)
    {
        var logger = sp.GetRequiredService<ILogger<BackgroundJobLogger>>();
        return new BackgroundJobLogger(job, performContext, context, categoryName, logger);
    }

    public void Dispose() { }
}
