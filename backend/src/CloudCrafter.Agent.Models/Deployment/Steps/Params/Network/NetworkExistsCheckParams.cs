namespace CloudCrafter.Agent.Models.Deployment.Steps.Params.Network;

public class NetworkExistsCheckParams : BaseParams
{
    public List<string> Networks { get; init; } = new();
}
