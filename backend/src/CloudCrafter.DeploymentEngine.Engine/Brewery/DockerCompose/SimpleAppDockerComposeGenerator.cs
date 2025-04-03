using CloudCrafter.DeploymentEngine.Engine.Abstraction;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Actions;
using CloudCrafter.DockerCompose.Engine.Models;
using CloudCrafter.DockerCompose.Engine.Yaml;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.DockerCompose;

public class SimpleAppDockerComposeGenerator(BaseDockerComposeGenerator.Args args)
    : BaseDockerComposeGenerator(args)
{
    public override DockerComposeEditor Generate()
    {
        ValidateGenerator();

        var firstService = Options.Stack.Services.FirstOrDefault();
        // Should be validated, but just in case.
        if (firstService == null)
        {
            throw new InvalidOperationException(
                "SimpleAppGenerator can only be used with stacks that have at least one service."
            );
        }

        var editor = new DockerComposeEditor();
        editor.SetEnvironmentVariables(".env", new List<EnvironmentVariable>());

        var networkName = Options.Stack.Server?.DockerNetwork ?? "cloudcrafter";
        var network = editor.AddNetwork(networkName);
        network.SetIsExternalNetwork();

        AddAppService(firstService, editor, network);

        return editor;
    }

    private void AddAppService(
        StackService stackService,
        DockerComposeEditor editor,
        DockerComposeEditor.NetworkEditor network
    )
    {
        var dockerComposeServiceName = stackService.Name;
        var service = editor.AddService(dockerComposeServiceName);
        var labelService = new DockerComposeLabelService();

        AddBasicLabels(labelService, stackService);
        AddProxyLabels(labelService, stackService, service.ServiceName());
        AddHealthCheck(service, stackService);

        service.AddLabels(labelService);
        service.AddNetwork(network);
        service.SetEnvironmentFilename(".env");
        service.SetImage(stackService.Id.ToString(), "latest");

        var volumesAction = new AddVolumesAction();
        volumesAction.Execute(this, editor, service, stackService);
    }

    public override void ValidateGenerator()
    {
        // This generator only should be used with simple, one service stacks.
        // TODO: Move this validation to somewhere else. It's not the job of the SimpleAppGenerator to validate the stack.
        if (Options.Stack.Services.Count != 1)
        {
            throw new InvalidOperationException(
                "SimpleAppGenerator can only be used with stacks that have exactly one service."
            );
        }
    }
}
