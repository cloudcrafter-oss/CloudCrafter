using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Domain.Entities;
using Hangfire;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace CloudCrafter.Core.Jobs;

public class JobScheduler(IBackgroundJobClient backgroundJobClient, IServiceScopeFactory serviceScopeFactory)
{
    public string Enqueue<TJob>(params object[] args) where TJob : IJob
    {
        return backgroundJobClient.Enqueue<JobScheduler>(x => x.ExecuteJob<TJob>(args));
    }
    private async Task<CloudCrafter.Domain.Entities.BackgroundJob> CreateLogEntityAsync(IServiceProvider serviceProvider, string jobName)
    {
        var dbContext = serviceProvider.GetRequiredService<IApplicationDbContext>();
        var logEntity = new CloudCrafter.Domain.Entities.BackgroundJob
        {
            Id = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Status = BackgroundJobStatus.Created,
            SerializedArguments = JsonSerializer.Serialize(),
            HangfireJobId = string.Empty,
            Type = BackgroundJobType.StackDeployment
        };
        dbContext.Jobs.Add(logEntity);
        await dbContext.SaveChangesAsync();
        return logEntity;
    }
    
    private async Task UpdateLogEntityAsync(IServiceProvider serviceProvider, int logEntityId, BackgroundJobStatus status, string errorMessage = null)
    {
        var dbContext = serviceProvider.GetRequiredService<IApplicationDbContext>();
        var logEntity = await dbContext.Jobs.FindAsync(logEntityId);
        if (logEntity != null)
        {
            logEntity.UpdatedAt = DateTime.UtcNow;
            logEntity.Status = status;
            await dbContext.SaveChangesAsync();
        }
    }
    
    public async Task ExecuteJob<TJob>(object[] args) where TJob : IJob
    {
        using (var scope = serviceScopeFactory.CreateScope())
        {
            var job = ActivatorUtilities.CreateInstance<TJob>(scope.ServiceProvider, args);

            if (job is ILoggableJob loggableJob)
            {
                var logEntity = await CreateLogEntityAsync(scope.ServiceProvider, typeof(TJob).Name);

                try
                {
                    await loggableJob.Handle(scope.ServiceProvider, _loggerFactory);
                    await UpdateLogEntityAsync(scope.ServiceProvider, logEntity.Id, "Completed");
                }
                catch (Exception ex)
                {
                    await UpdateLogEntityAsync(scope.ServiceProvider, logEntity.Id, "Failed", ex.Message);
                    throw;
                }
            }
            else
            {
                await job.Handle(scope.ServiceProvider);
            }
        }
    }
    
}
