using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs;

public interface IJob
{
    BackgroundJobType Type { get; }
    bool ShouldRunOnApiServer { get; }
    Task HandleEntity(IApplicationDbContext context, string jobId);
    Task TearDown();

    Task Handle(
        IServiceProvider serviceProvider,
        IApplicationDbContext context,
        ILoggerFactory loggerFactory,
        string jobId
    );
}
