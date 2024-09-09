using CloudCrafter.DockerCompose.Engine.Yaml;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.DeploymentEngine.Engine.Abstraction;

public abstract class BaseDockerComposeGenerator
{
    protected readonly Args Options;

    protected BaseDockerComposeGenerator(Args options)
    {
        Options = options;

        Validate();
    }

    private void Validate()
    {
    }

    public abstract DockerComposeEditor Generate();
    public abstract void ValidateGenerator();

    public class Args
    {
        public required Stack Stack { get; init; }
    }
}
