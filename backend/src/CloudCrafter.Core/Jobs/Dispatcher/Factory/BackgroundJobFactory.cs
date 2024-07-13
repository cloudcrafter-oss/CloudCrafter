using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Jobs.Logger;
using CloudCrafter.Domain.Entities;
using Hangfire;
using Microsoft.Extensions.Logging;
using BackgroundJob = CloudCrafter.Domain.Entities.BackgroundJob;

namespace CloudCrafter.Core.Jobs.Dispatcher.Factory;

public class BackgroundJobFactory(IApplicationDbContext context)
{
    public async Task<string> CreateAndEnqueueJobAsync<TParam>(IBaseJob<TParam> job, TParam parameters)
    {
        var backgroundJob = new BackgroundJob
        {
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Type = job.Type,
            Status = BackgroundJobStatus.Created,
            Id = Guid.NewGuid(),
            HangfireJobId = null
        };

        context.Jobs.Add(backgroundJob);

        await context.SaveChangesAsync();

        // TODO: Add Context tracker?
        var jobId = Hangfire.BackgroundJob.Enqueue(() => ExecuteJobAsync(job, job.Type, backgroundJob.Id, parameters));
        backgroundJob.HangfireJobId = jobId;
        await context.SaveChangesAsync();

        return jobId;
    }

    [JobDisplayName("{1}")]
    public async Task ExecuteJobAsync<TParam>(IBaseJob<TParam> job,  BackgroundJobType type, Guid backgroundJobId, TParam parameters)
    {
        var backgroundJob = await context.Jobs.FindAsync(backgroundJobId);
        if (backgroundJob == null)
        {
            throw new ArgumentException("Background job not found", nameof(backgroundJob));
        }

        var loggerFactory = new BackgroundJobLoggerFactory(backgroundJob, context);

        try
        {
            backgroundJob.Status = BackgroundJobStatus.Running;
            await context.SaveChangesAsync();

            await job.ExecuteAsync(backgroundJob, parameters, loggerFactory);

            backgroundJob.Status = BackgroundJobStatus.Completed;
            backgroundJob.CompletedAt = DateTime.UtcNow;
        }
        catch (Exception ex)
        {
            backgroundJob.Status = BackgroundJobStatus.Failed;

            var logger = loggerFactory.CreateLogger("ExecuteJobAsync");
            logger.LogError(ex, "Job execution failed");
        }
        finally
        {
            await context.SaveChangesAsync();
        }
    }
}
