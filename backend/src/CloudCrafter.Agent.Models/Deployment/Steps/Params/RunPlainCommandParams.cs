namespace CloudCrafter.Agent.Models.Deployment.Steps.Params;

public class RunPlainCommandParams : BaseParams
{
    public bool? AllowFailure { get; init; } = false;
    public string Command { get; init; } = string.Empty;
}
