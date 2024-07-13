using System.Text.Json;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Jobs.Creation;
using CloudCrafter.Core.Jobs.Logger;
using CloudCrafter.Core.Jobs.Servers;
using CloudCrafter.Domain.Entities;
using Hangfire;
using Hangfire.Processing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using BackgroundJob = CloudCrafter.Domain.Entities.BackgroundJob;

namespace CloudCrafter.Core.Jobs.Dispatcher.Factory;

public class BackgroundJobFactory(IApplicationDbContext context, IServiceProvider sp, IBackgroundJobClient client)
{
    public async Task<string> CreateAndEnqueueJobAsync<TJob, TParam>(TParam parameters) where TJob : IBaseJob<TParam>
    {
        var strategy = sp.GetRequiredService<IJobCreationStrategy<TJob, TParam>>();

        await using var transaction = await context.BeginTransactionAsync();
        try
        {
            var backgroundJob = await strategy.CreateJobAsync(parameters);

            context.Jobs.Add(backgroundJob);
            await context.SaveChangesAsync();

            var hangfireJobId = client.Enqueue(() => ExecuteJobAsync(backgroundJob.Id, backgroundJob.Type));
            
            backgroundJob.HangfireJobId = hangfireJobId;
            await context.SaveChangesAsync();

            await transaction.CommitAsync();

            return hangfireJobId;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    [JobDisplayName("{0}")]
    public async Task ExecuteJobAsync(Guid backgroundJobId, BackgroundJobType jobType)
    {
        using var scope = sp.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();

        var backgroundJob = await dbContext.Jobs.FindAsync(backgroundJobId);
        if (backgroundJob == null)
        {
            throw new ArgumentException("Background job not found", nameof(backgroundJobId));
        }

        var loggerFactory = new BackgroundJobLoggerFactory(backgroundJob, dbContext);

        try
        {
            backgroundJob.Status = BackgroundJobStatus.Running;
            await dbContext.SaveChangesAsync();

            switch (jobType)
            {
                case BackgroundJobType.ServerConnectivityCheck:
                    await ExecuteTypedJobAsync<ConnectivityCheckBackgroundJob, Server>(backgroundJob, scope);
                    break;
                // Add other job types as needed
                default:
                    throw new ArgumentException($"Unsupported job type: {jobType}");
            }

            backgroundJob.Status = BackgroundJobStatus.Completed;
            backgroundJob.CompletedAt = DateTime.UtcNow;
        }
        catch (Exception ex)
        {
            backgroundJob.Status = BackgroundJobStatus.Failed;
            var logger = loggerFactory.CreateLogger<BackgroundJobFactory>();
            logger.LogError(ex, "Job execution failed");
        }
        finally
        { 
            await dbContext.SaveChangesAsync();
        }
    }

    private async Task ExecuteTypedJobAsync<TJob, TParam>(BackgroundJob backgroundJob, IServiceScope scope)
        where TJob : IBaseJob<TParam>
    {
        var job = scope.ServiceProvider.GetRequiredService<TJob>();
        var parameter = JsonSerializer.Deserialize<TParam>(backgroundJob.SerializedArguments);
        if (parameter == null)
        {
            throw new ArgumentException("Failed to deserialize job parameters");
        }

        var loggerFactory = new BackgroundJobLoggerFactory(backgroundJob,
            scope.ServiceProvider.GetRequiredService<IApplicationDbContext>());

        await job.ExecuteAsync(backgroundJob, parameter, loggerFactory);
    }
}

