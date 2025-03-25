using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Domain.Domain.Stack;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.Service;

[Authorize]
public record UpdateStackServiceCommand(
    Guid StackId,
    Guid StackServiceId,
    string? Name = null,
    string? DomainName = null,
    int? ContainerPortExposes = null,
    int? ContainerHealthCheckPort = null
) : IRequest<StackServiceDto?>, IRequireStackAccess;

internal class UpdateStackServiceCommandHandler(IStackServicesService stackServicesService)
    : IRequestHandler<UpdateStackServiceCommand, StackServiceDto?>
{
    public async Task<StackServiceDto?> Handle(
        UpdateStackServiceCommand request,
        CancellationToken cancellationToken
    )
    {
        var stack = await stackServicesService.UpdateStackService(request);

        return stack;
    }
}
