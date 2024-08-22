using System.Diagnostics;
using System.Text.Json;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Jobs.Creation;
using CloudCrafter.Core.Jobs.Logger;
using CloudCrafter.Core.Jobs.Servers;
using CloudCrafter.Domain.Entities;
using Hangfire;
using Hangfire.Console;
using Hangfire.Server;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using BackgroundJob = CloudCrafter.Domain.Entities.BackgroundJob;

namespace CloudCrafter.Core.Jobs.Dispatcher.Factory;

public class BackgroundJobFactory(
    IApplicationDbContext context,
    IServiceProvider sp,
    IBackgroundJobClient client,
    ILogger<BackgroundJobFactory> logger)
{
    public async Task<string> CreateAndEnqueueJobAsync<TJob, TParam>(TParam parameters) where TJob : IBaseJob<TParam>
    {
        logger.LogDebug("[CreateAndEnqueueJobAsync] Creating and enqueuing job of type {JobType}", typeof(TJob).Name);
        var strategy = sp.GetRequiredService<IJobCreationStrategy<TJob, TParam>>();

        await using var transaction = await context.BeginTransactionAsync();
        try
        {
            var backgroundJob = await strategy.CreateJobAsync(parameters);


            context.Jobs.Add(backgroundJob);
            await context.SaveChangesAsync();

            var hangfireJobId =
                client.Enqueue<CloudCrafterJob>(job => job.ExecuteJobAsync(backgroundJob.Id, backgroundJob.Type, null));

            backgroundJob.HangfireJobId = hangfireJobId;
            await context.SaveChangesAsync();

            await transaction.CommitAsync();

            return hangfireJobId;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            await transaction.RollbackAsync();
            throw;
        }
    }
}

public class CloudCrafterJob(ILogger<CloudCrafterJob> logger, IServiceProvider sp)
{
    [JobDisplayName("{1}")]
    public async Task ExecuteJobAsync(Guid backgroundJobId, BackgroundJobType jobType, PerformContext? performContext)
    {
#if IN_TESTS
        // In tests, the job is executed synchronously (in memory)
        // So we need to wait until the DBContext is done saving the job to the database.
        System.Console.WriteLine("Sleeping 5000ms");
        await Task.Delay(5000);
#endif
        logger.LogDebug("Executing job {BackgroundJobId} of type {JobType}", backgroundJobId, jobType);
        performContext.WriteLine("Executing job {0} of type {1}", backgroundJobId, jobType);
        using var scope = sp.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();

        var backgroundJob = await dbContext.Jobs
            .Include(x => x.ServerConnectivityCheckJob)
            .ThenInclude(x => x != null ? x.Server : null)
            .FirstOrDefaultAsync(x => x.Id == backgroundJobId);
        if (backgroundJob == null)
        {
            throw new ArgumentException("Background job not found", nameof(backgroundJobId));
        }

        var loggerFactory =
            new BackgroundJobLoggerFactory(backgroundJob, performContext, dbContext, scope.ServiceProvider);

        var stopwatch = Stopwatch.StartNew();
        try
        {
            backgroundJob.Status = BackgroundJobStatus.Running;
            await dbContext.SaveChangesAsync();

            switch (jobType)
            {
                case BackgroundJobType.ServerConnectivityCheck:
                    await ExecuteTypedJobAsync<ConnectivityCheckBackgroundJob, Server>(backgroundJob, performContext,
                        scope);
                    break;
                // Add other job types as needed
                default:
                    throw new ArgumentException($"Unsupported job type: {jobType}");
            }

            backgroundJob.Status = BackgroundJobStatus.Completed;
        }
        catch (Exception ex)
        {
            backgroundJob.Status = BackgroundJobStatus.Failed;
            var logger = loggerFactory.CreateLogger<BackgroundJobFactory>();
            logger.LogError(ex, "Job execution failed");
        }
        finally
        {
            stopwatch.Stop();
            backgroundJob.RunningTime = stopwatch.ElapsedMilliseconds;
            backgroundJob.CompletedAt = DateTime.UtcNow;
            await dbContext.SaveChangesAsync();
        }
    }

    private async Task ExecuteTypedJobAsync<TJob, TParam>(BackgroundJob backgroundJob, PerformContext? performContext,
        IServiceScope scope)
        where TJob : IBaseJob<TParam>
    {
        var job = scope.ServiceProvider.GetRequiredService<TJob>();
        var parameter = JsonSerializer.Deserialize<TParam>(backgroundJob.SerializedArguments);
        if (parameter == null)
        {
            throw new ArgumentException("Failed to deserialize job parameters");
        }

        logger.LogDebug("Creating background job factory");
        var loggerFactory = new BackgroundJobLoggerFactory(backgroundJob, performContext,
            scope.ServiceProvider.GetRequiredService<IApplicationDbContext>(), scope.ServiceProvider);

        await job.ExecuteAsync(backgroundJob, parameter, loggerFactory);
    }
}
