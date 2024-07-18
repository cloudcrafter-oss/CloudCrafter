namespace CloudCrafter.Agent.Models.Deployment.Steps;

public class DeploymentStepResult<T>
{
    public T? Result { get; set; }
    public bool IsSuccess { get; set; }
    public bool HasError { get; set; }
    public bool CanContinueOnError { get; set; }
}
