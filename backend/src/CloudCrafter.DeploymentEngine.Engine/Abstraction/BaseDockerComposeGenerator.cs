using CloudCrafter.DockerCompose.Engine.Yaml;
using CloudCrafter.DockerCompose.Shared.Labels;
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

    protected void AddBasicLabels(DockerComposeLabelService labelService, StackService service)
    {
        labelService.AddLabel(LabelFactory.GenerateManagedLabel());
        labelService.AddLabel(LabelFactory.GenerateStackLabel(service.StackId));
        labelService.AddLabel(LabelFactory.GenerateStackServiceLabel(service.Id));
        labelService.AddLabel(LabelFactory.GenerateDeploymentLabel(Options.DeploymentId));
    }

    protected void AddProxyLabels(DockerComposeLabelService labelService, string serviceName)
    {
        labelService.AddTraefikLabels(new DockerComposeLabelServiceTraefikOptions()
        {
            AppName = serviceName,
            LoadBalancerPort = 3000,
            Service = serviceName,
            Rule = $"Host(`{serviceName}.127.0.0.1.sslip.io`)"
        });
    }

    public class Args
    {
        public required Guid DeploymentId { get; init; }
        public required Stack Stack { get; init; }
    }
}
