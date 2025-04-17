using CloudCrafter.DeploymentEngine.Engine.Abstraction;
using CloudCrafter.DockerCompose.Engine.Yaml;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.Actions;

public abstract class BaseAction
{
    public abstract void Execute(
        BaseDockerComposeGenerator generator,
        DockerComposeEditor editor,
        DockerComposeEditor.ServiceEditor service,
        StackService stackService
    );
}
