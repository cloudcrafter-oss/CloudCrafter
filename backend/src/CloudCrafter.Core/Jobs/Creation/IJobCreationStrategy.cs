using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Jobs.Creation;

public interface IJobCreationStrategy<TJob, TParam>
{
    Task<BackgroundJob> CreateJobAsync(TParam parameter);
}
