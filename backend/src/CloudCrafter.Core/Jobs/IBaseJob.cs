using CloudCrafter.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs;

public interface IBaseJob<in TParam>
{
    string JobName { get; }
    BackgroundJobType Type { get; }
    Task ExecuteAsync(BackgroundJob backgroundJob, TParam parameter, ILoggerFactory loggerFactory);
}
