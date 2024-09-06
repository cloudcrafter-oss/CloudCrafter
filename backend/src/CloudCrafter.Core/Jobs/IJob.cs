using CloudCrafter.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs;

public interface IJob
{
    BackgroundJobType Type { get; }
    Task Handle(IServiceProvider serviceProvider, ILoggerFactory loggerFactory, string jobId);
}
