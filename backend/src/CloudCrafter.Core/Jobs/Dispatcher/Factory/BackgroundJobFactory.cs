using System.Diagnostics;
using System.Text.Json;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Jobs.Hangfire;
using CloudCrafter.Core.Jobs.Logger;
using CloudCrafter.Core.Jobs.Serializer;
using CloudCrafter.Domain.Entities;
using Hangfire;
using Hangfire.Console;
using Hangfire.Server;
using Hangfire.States;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using BackgroundJob = CloudCrafter.Domain.Entities.BackgroundJob;

namespace CloudCrafter.Core.Jobs.Dispatcher.Factory;

public class BackgroundJobFactory(
    IApplicationDbContext context,
    JobSerializer jobSerializer,
    IBackgroundJobClient client,
    ILogger<BackgroundJobFactory> logger
)
{
    /// <summary>
    ///     Creates and enqueues a job on the background
    /// </summary>
    /// <param name="parameters"></param>
    /// <typeparam name="TJob"></typeparam>
    /// <returns>The Hangfire Job id</returns>
    public async Task<string> CreateAndEnqueueJobAsync<TJob>(IJob job)
    {
        logger.LogDebug(
            "[CreateAndEnqueueJobAsync] Creating and enqueuing job of type {JobType}",
            typeof(TJob).Name
        );
        await using var transaction = await context.BeginTransactionAsync();
        try
        {
            var serializedJob = await jobSerializer.Serialize<TJob>(job);

            var backgroundJob = new BackgroundJob
            {
                Id = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Status = BackgroundJobStatus.Created,
                SerializedArguments = JsonSerializer.Serialize(serializedJob),
                HangfireJobId = string.Empty,
                Type = job.Type,
            };

            context.Jobs.Add(backgroundJob);
            await context.SaveChangesAsync();

            // var hangfireJobId =
            // client.Enqueue<CloudCrafterJob>(job => job.ExecuteJobAsync(backgroundJob.Id, backgroundJob.Type, null));

            var hangfireJobId = client.Create<CloudCrafterJob>(
                job => job.ExecuteBackgroundJobAsync(backgroundJob.Id, backgroundJob.Type, null),
                new CreatedState()
            );
            backgroundJob.HangfireJobId = hangfireJobId;

            // hangfireJobIdclient.
            await context.SaveChangesAsync();

            await transaction.CommitAsync();

            client.ChangeState(hangfireJobId, new EnqueuedState());

            return hangfireJobId;
        }
        catch (Exception ex)
        {
            logger.LogCritical(ex, "Failed to create and enqueue job");
            await transaction.RollbackAsync();
            throw;
        }
    }
}

public class CloudCrafterJob(ILogger<CloudCrafterJob> logger, IServiceProvider sp)
{
    [Queue("worker")]
    [JobDisplayName("{1}")]
    public Task ExecuteBackgroundJobAsync(
        Guid backgroundJobId,
        BackgroundJobType backgroundJobType,
        PerformContext? performContext
    )
    {
        return ExecuteJobInternalAsync(backgroundJobId, backgroundJobType, performContext);
    }

    [Queue("web")]
    [JobDisplayName("{1}")]
    [DisableConcurrentExecution(60)]
    public Task ExecuteJobOnHubServer(
        Guid backgroundJobId,
        BackgroundJobType backgroundJobType,
        PerformContext? performContext
    )
    {
        return ExecuteJobInternalAsync(backgroundJobId, backgroundJobType, performContext);
    }

    private async Task ExecuteJobInternalAsync(
        Guid backgroundJobId,
        BackgroundJobType backgroundJobType,
        PerformContext? performContext
    )
    {
#if IN_TESTS
        // In tests, the job is executed synchronously (in memory)
        // So we need to wait until the DBContext   is done saving the job to the database.
        // So again, sorry. Feel free to open a PR if you're able to fix this.
        System.Console.WriteLine("Sleeping 5000ms");
        await Task.Delay(5000);
#endif
        if (performContext == null)
        {
            throw new ArgumentNullException("PerformContext should not be null in this context");
        }

        logger.LogDebug("Executing job {BackgroundJobId}", backgroundJobId);
        performContext.WriteLine("Executing job {0}");
        using var scope = sp.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();

        var backgroundJob = await dbContext
            .Jobs.Include(x => x.ServerConnectivityCheckJob)
            .ThenInclude(x => x != null ? x.Server : null)
            .FirstOrDefaultAsync(x => x.Id == backgroundJobId);
        if (backgroundJob == null)
        {
            throw new ArgumentException("Background job not found", nameof(backgroundJobId));
        }

        logger.LogDebug("Executing background job of type {Type}", backgroundJob.Type);

        var loggerFactory = new BackgroundJobLoggerFactory(
            backgroundJob,
            performContext,
            dbContext,
            scope.ServiceProvider
        );

        var stopwatch = Stopwatch.StartNew();
        try
        {
            backgroundJob.Status = BackgroundJobStatus.Running;
            await dbContext.SaveChangesAsync();

            var jobSerializer = scope.ServiceProvider.GetRequiredService<JobSerializer>();
            var jobArgs = JsonSerializer.Deserialize<SerializedJobResult>(
                backgroundJob.SerializedArguments
            );

            if (jobArgs is null)
            {
                throw new ArgumentNullException("Failed to deserialize job arguments");
            }

            var type = Type.GetType(jobArgs.JobType);

            if (type == null)
            {
                throw new ArgumentException("Failed to get job type");
            }

            var jobFromSerializer = await jobSerializer.Deserialize(jobArgs.SerializedJob, type);

            if (jobFromSerializer is null)
            {
                throw new ArgumentNullException("Failed to deserialize job");
            }

            try
            {
                await jobFromSerializer.HandleEntity(dbContext, performContext.BackgroundJob.Id);

                await jobFromSerializer.Handle(
                    scope.ServiceProvider,
                    dbContext,
                    loggerFactory,
                    performContext.BackgroundJob.Id
                );
            }
            finally
            {
                logger.LogDebug("Tearing down job");
                await jobFromSerializer.TearDown();
            }

            backgroundJob.Status = BackgroundJobStatus.Completed;
        }
        catch (Exception ex)
        {
            backgroundJob.Status = BackgroundJobStatus.Failed;
            var mLogger = loggerFactory.CreateLogger<BackgroundJobFactory>();
            mLogger.LogError(ex, "Job execution failed, exception: {Exception}", ex.Message);
        }
        finally
        {
            stopwatch.Stop();
            backgroundJob.RunningTime = stopwatch.ElapsedMilliseconds;
            backgroundJob.CompletedAt = DateTime.UtcNow;
            await dbContext.SaveChangesAsync();
        }
    }
}
