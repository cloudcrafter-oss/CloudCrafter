using System.Text.Json;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Jobs.Logger;
using CloudCrafter.Domain.Entities;
using Hangfire;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using BackgroundJob = CloudCrafter.Domain.Entities.BackgroundJob;

namespace CloudCrafter.Core.Jobs.Dispatcher.Factory;

public class BackgroundJobFactory(IApplicationDbContext context, IServiceProvider sp, IBackgroundJobClient client)
{
    public async Task<string> CreateAndEnqueueJobAsync<TJob, TParam>(TParam parameters) where TJob : IBaseJob<TParam>
    {
        var backgroundJob = new BackgroundJob
        {
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Type = BackgroundJobType.ServerConnectivityCheck, // TODO: Changeme
            SerializedArguments = JsonSerializer.Serialize(parameters),
            Status = BackgroundJobStatus.Created,
            Id = Guid.NewGuid(),
            HangfireJobId = null
        };

        context.Jobs.Add(backgroundJob);

        await context.SaveChangesAsync();

        // TODO: Add Context tracker?
        var hangfireJobId = client.Enqueue<BackgroundJobFactory>(x => x.ExecuteJobAsync<TJob, TParam>(backgroundJob.Id, backgroundJob.Type));
        backgroundJob.HangfireJobId = hangfireJobId;
        await context.SaveChangesAsync();

        return hangfireJobId;
    }

    [JobDisplayName("{1}")]
    public async Task ExecuteJobAsync<TJob, TParam>(Guid backgroundJobId, BackgroundJobType type) 
        where TJob : IBaseJob<TParam>
    {
        using var scope = sp.CreateScope();

        var job = scope.ServiceProvider.GetRequiredService<TJob>();
        var dbContext = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();
        var backgroundJob = await dbContext.Jobs.FindAsync(backgroundJobId);
        
        if (backgroundJob == null)
        {
            throw new ArgumentException("Background job not found", nameof(backgroundJob));
        }

        var parameter = JsonSerializer.Deserialize<TParam>(backgroundJob.SerializedArguments);

        if (parameter == null)
        {
            throw new ArgumentException("Failed to deserialize job parameters", nameof(parameter));
        }
        
        var loggerFactory = new BackgroundJobLoggerFactory(backgroundJob, dbContext);

        try
        {
            backgroundJob.Status = BackgroundJobStatus.Running;
            await context.SaveChangesAsync();

            await job.ExecuteAsync(backgroundJob, parameter, loggerFactory);

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
