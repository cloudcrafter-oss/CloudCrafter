using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Logger;

public class BackgroundJobLoggerFactory(BackgroundJob job, IApplicationDbContext context) : ILoggerFactory
{
    public void AddProvider(ILoggerProvider provider) { }

    public ILogger CreateLogger(string categoryName)
    {
        return new BackgroundJobLogger(job, context, categoryName);
    }

    public void Dispose() { }
}
