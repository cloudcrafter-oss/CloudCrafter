using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs;

public interface ILoggableJob : IJob
{
    Task Handle(IServiceProvider serviceProvider, ILoggerFactory loggerFactory);
}
