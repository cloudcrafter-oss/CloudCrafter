using Hangfire.Server;

namespace CloudCrafter.Jobs.Infrastructure.Jobs.Context.Deployments;

public class DeploymentTracker : IDeploymentTracker
{
    private Guid _deploymentId = Guid.Empty;

    private PerformContext? _context;
    public void SetDeploymentContext(PerformContext context)
    {
        _context = context;
    }

    public PerformContext? GetContext()
    {
        return _context;
    }

    public Guid GetDeploymentId() => _deploymentId;

    public void SetDeploymentId(Guid id) => _deploymentId = id;
}
