namespace CloudCrafter.Jobs.Infrastructure.Logging;

public class CloudCrafterLoggerFactory
{
    public JobLogger CreateLogger(string deploymentId) => new JobLogger(deploymentId);
}
