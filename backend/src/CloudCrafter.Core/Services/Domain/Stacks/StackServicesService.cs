using AutoMapper;
using Bogus.DataSets;
using CloudCrafter.Core.Commands.Stacks.Service;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Stack;

namespace CloudCrafter.Core.Services.Domain.Stacks;

public class StackServicesService(IStackRepository stackRepository, IMapper mapper)
    : IStackServicesService
{
    public async Task AddAppServiceToStack(Guid stackId, string name)
    {
        await stackRepository.AddAppServiceToStack(stackId, name);
    }

    public async Task<StackServiceDto?> UpdateStackService(
        UpdateStackServiceCommand.Command request
    )
    {
        var stackService = await stackRepository.GetService(request.StackServiceId);

        if (stackService == null)
        {
            return null;
        }

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            stackService.Name = request.Name;
        }

        if (request.DomainName != null)
        {
            // Note the check - it can be an empty string!
            stackService.HttpConfiguration ??= new()
            {
                DomainName = request.Name,
                ContainerHttpPort = null,
            };

            stackService.HttpConfiguration.DomainName = request.DomainName;
        }

        if (request.ContainerPortExposes.HasValue)
        {
            stackService.HttpConfiguration ??= new()
            {
                DomainName = null,
                ContainerHttpPort = null,
            };

            stackService.HttpConfiguration.ContainerHttpPort = request.ContainerPortExposes;
        }

        if (request.ContainerHealthCheckPort.HasValue)
        {
            stackService.HealthcheckConfiguration.HttpPort = request.ContainerHealthCheckPort;
        }

        await stackRepository.SaveChangesAsync();

        return mapper.Map<StackServiceDto>(stackService);
    }
}
