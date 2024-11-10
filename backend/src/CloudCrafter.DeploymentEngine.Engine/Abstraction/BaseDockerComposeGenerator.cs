using CloudCrafter.DockerCompose.Engine.Models;
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

    private void Validate() { }

    public abstract DockerComposeEditor Generate();
    public abstract void ValidateGenerator();

    protected void AddBasicLabels(DockerComposeLabelService labelService, StackService service)
    {
        labelService.AddLabel(LabelFactory.GenerateManagedLabel());
        labelService.AddLabel(LabelFactory.GenerateStackLabel(service.StackId));
        labelService.AddLabel(LabelFactory.GenerateStackServiceLabel(service.Id));
        labelService.AddLabel(LabelFactory.GenerateDeploymentLabel(Options.DeploymentId));
    }

    protected void AddHealthCheck(
        DockerComposeEditor.ServiceEditor serviceEditor,
        StackService stackService
    )
    {
        var config = stackService.HealthcheckConfiguration;
        var stackServiceHealthcheckValid = config.ConfigurationValid();

        if (!stackServiceHealthcheckValid)
        {
            return;
        }

        serviceEditor.AddHealthCheck(
            new ServiceHealthCheck
            {
                Test =
                    $"curl -f http://{stackService.HealthcheckConfiguration.HttpHost}:{stackService.HealthcheckConfiguration.HttpPort}{stackService.HealthcheckConfiguration.HttpPath}",
                IntervalSeconds = 3,
                Retries = config.MaxRetries,
                StartPeriodSeconds = 3,
                TimeoutSeconds = 4,
            }
        );
    }

    protected void AddProxyLabels(
        DockerComposeLabelService labelService,
        StackService stackService,
        string serviceName
    )
    {
        if (string.IsNullOrWhiteSpace(stackService.HttpConfiguration?.DomainName))
        {
            // No domain name set, so we add no reverse proxy labels.
            return;
        }

        labelService.AddTraefikLabels(
            new DockerComposeLabelServiceTraefikOptions
            {
                AppName = stackService.Id.ToString(),
                LoadBalancerPort =
                    stackService.HttpConfiguration.ContainerHttpPort.GetValueOrDefault(-1),
                Service = stackService.Id.ToString(),
                Rule = $"Host(`{stackService.HttpConfiguration.DomainName}`)",
            }
        );
    }

    public class Args
    {
        public required Guid DeploymentId { get; init; }
        public required Stack Stack { get; init; }
    }
}
