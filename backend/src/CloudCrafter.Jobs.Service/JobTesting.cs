using CloudCrafter.Jobs.Service.Jobs;
using Hangfire;
using Hangfire.Console;
using Hangfire.Server;

namespace CloudCrafter.Jobs.Service;

public static class JobTesting
{
    public static void Fire()
    {
        BackgroundJob.Enqueue<TestDeploymentJob>(job => job.RunAsync(null, new DeploymentArgs { Id = Guid.NewGuid() }));
        BackgroundJob.Enqueue<TestDeploymentJob>(job => job.RunAsync(null, new DeploymentArgs { Id = Guid.NewGuid() }));
        BackgroundJob.Enqueue<TestDeploymentJob>(job => job.RunAsync(null, new DeploymentArgs { Id = Guid.NewGuid() }));
        BackgroundJob.Enqueue<TestDeploymentJob>(job => job.RunAsync(null, new DeploymentArgs { Id = Guid.NewGuid() }));
        BackgroundJob.Enqueue<TestDeploymentJob>(job => job.RunAsync(null, new DeploymentArgs { Id = Guid.NewGuid() }));
    }

    public static void FireFailJob()
    {
        BackgroundJob.Enqueue<TestJobThatWillFail>(job => job.RunAsync(null));
    }
}

public class TestJobThatWillFail
{
    [AutomaticRetry(Attempts = 0)]
    public async Task RunAsync(PerformContext? context)
    {
        context!.WriteLine("Starting example job...");

        // Simulate some work
        for (var i = 0; i < 10; i++)
        {
            await Task.Delay(1000);
            context.WriteProgressBar(i * 10);
            context.WriteLine($"Step {i + 1} completed");
        }

        throw new Exception("Dummy exception");
    }
}

public class TestJob
{
    public async Task RunAsync(PerformContext? context)
    {
        context!.WriteLine("Starting example job...");

        // Simulate some work
        for (var i = 0; i < 10; i++)
        {
            await Task.Delay(1000);
            context.WriteProgressBar(i * 10);
            context.WriteLine($"Step {i + 1} completed");
        }

        context.WriteLine("Example job completed successfully!");
    }
}
