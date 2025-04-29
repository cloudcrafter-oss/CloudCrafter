using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Core.Utils;
using CloudCrafter.DockerCompose.Engine.Yaml;
using CloudCrafter.Domain.Domain.Application.Services;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Services.Domain.Stacks;

public class StackServiceProvisioner(IStackRepository stackRepository) : IStackServiceProvisioner
{
    public async Task ProvisionStackFromYaml(Guid stackId, string? yaml)
    {
        if (string.IsNullOrWhiteSpace(yaml))
        {
            return;
        }

        var stack = await stackRepository.GetStack(stackId);
        if (stack == null)
        {
            throw new Exception($"Stack with id {stackId} not found");
        }

        stack.DockerComposeData.DockerComposeFile = yaml;

        var editor = new DockerComposeEditor(yaml);

        var services = editor.Services();

        foreach (var dockerComposeServiceName in services)
        {
            var service = editor.Service(dockerComposeServiceName);
            await HandleComposeService(stack, service);
        }

        await stackRepository.SaveChangesAsync();
    }

    private async Task HandleComposeService(
        Stack stack,
        DockerComposeEditor.ServiceEditor serviceEditor
    )
    {
        var name = serviceEditor.ServiceName();

        var service = stack.Services.FirstOrDefault(x => x.DockerComposeData.ServiceName == name);

        if (service == null)
        {
            service = await stackRepository.AddServiceToStack(
                stack.Id,
                name,
                StackServiceTypes.App,
                false
            );
            stackRepository.AddService(service);
        }

        var labelIdentifier = new LabelIdentifier(serviceEditor);

        if (labelIdentifier.IsDatabase() && labelIdentifier.IsDatabasePostgres())
        {
            service.StackServiceTypeId = StackServiceTypeConstants.DatabasePostgres;
        }

        service.DockerComposeData.ServiceName = name;

        ConfigureEnvironmentVariables(stack, serviceEditor);
    }

    private void ConfigureEnvironmentVariables(
        Stack stack,
        DockerComposeEditor.ServiceEditor serviceEditor
    )
    {
        var envVars = serviceEditor.GetEnvironmentVariables();
    }
}
