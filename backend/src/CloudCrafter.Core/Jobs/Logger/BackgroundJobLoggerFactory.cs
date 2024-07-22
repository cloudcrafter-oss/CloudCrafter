using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Domain.Entities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Logger;

public class BackgroundJobLoggerFactory(BackgroundJob job, IApplicationDbContext context, IServiceProvider sp)
    : ILoggerFactory
{
    public void AddProvider(ILoggerProvider provider) { }

    public ILogger CreateLogger(string categoryName)
    {
        var logger = sp.GetRequiredService<ILogger<BackgroundJobLogger>>();
        return new BackgroundJobLogger(job, context, categoryName, logger);
    }

    public void Dispose() { }
}
