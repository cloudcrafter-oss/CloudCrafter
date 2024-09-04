using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs;

public interface IJob
{
    Task Handle(IServiceProvider serviceProvider, ILoggerFactory loggerFactory, string jobId);
}
