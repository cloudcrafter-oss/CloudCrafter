using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Domain.Utils;
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

internal class UpdateStackServiceCommandHandler
    : IRequestHandler<UpdateStackServiceCommand, StackServiceDto?>
{
    private readonly IStackServicesService _stackServicesService;
    private readonly IGitService _gitService;

    public UpdateStackServiceCommandHandler(
        IStackServicesService stackServicesService,
        IGitService gitService
    )
    {
        _stackServicesService = stackServicesService;
        _gitService = gitService;
    }

    public async Task<StackServiceDto?> Handle(
        UpdateStackServiceCommand request,
        CancellationToken cancellationToken
    )
    {
        var stack = await _stackServicesService.UpdateStackService(request);

        return stack;
    }
}
