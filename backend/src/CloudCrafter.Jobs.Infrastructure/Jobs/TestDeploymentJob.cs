using CloudCrafter.Jobs.Infrastructure.Jobs.Context.Deployments;
using Hangfire.Console;
using Hangfire.Server;

namespace CloudCrafter.Jobs.Infrastructure.Jobs;

public class TestDeploymentJob(IDeploymentTracker tracker)
{
    public async Task RunAsync(PerformContext? context, DeploymentArgs args)
    {
        context!.WriteLine("Debugger");

        if (context is not null)
        {
            tracker.SetDeploymentContext(context);
        }
        tracker.SetDeploymentId(args.Id);
        
        
        // Simulate some work
        for (var i = 0; i < 10; i++)
        {
            await Task.Delay(1000);
            context.WriteProgressBar(i * 10);
            context.WriteLine($"Step {i + 1} completed");
        }
        context!.WriteLine("done contex");
    }
}


public class DeploymentArgs
{
    public required Guid Id { get; init; }
}
