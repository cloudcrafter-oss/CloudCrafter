using Hangfire.Server;

namespace CloudCrafter.Jobs.Service.Jobs.Context.Deployments;

public class DeploymentTracker : IDeploymentTracker
{
    private Guid? _deploymentId;

    private PerformContext? _context;

    public void SetDeploymentContext(PerformContext context)
    {
        _context = context;
    }

    public PerformContext? GetContext()
    {
        return _context;
    }

    public Guid GetDeploymentId()
    {
        if (!_deploymentId.HasValue)
        {
            throw new Exception("Deployment ID has not been set");
        }

        return _deploymentId.Value;
    }

    public void SetDeploymentId(Guid id)
    {
        if (_deploymentId.HasValue)
        {
            throw new Exception("Cannot set a deployment ID more than once");
        }

        _deploymentId = id;
    }
}
