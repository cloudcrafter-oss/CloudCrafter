using Hangfire;
using Hangfire.Console;
using Hangfire.Server;

namespace CloudCrafter.Jobs.Service;

public static class JobTesting
{
    public static void Fire()
    {
        var jobId = BackgroundJob.Enqueue<TestJob>(job => job.RunAsync(null));
    }
}

public class TestJob
{
    public async Task RunAsync(PerformContext? context)
    {
        context!.WriteLine("Starting example job...");

        // Simulate some work
        for (int i = 0; i < 10; i++)
        {
            await Task.Delay(1000);
            context.WriteProgressBar(i * 10);
            context.WriteLine($"Step {i + 1} completed");
        }

        context.WriteLine("Example job completed successfully!");
    }
}
