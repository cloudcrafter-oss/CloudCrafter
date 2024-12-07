using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Domain.Utils;
using CloudCrafter.Domain.Domain.Stack;
using MediatR;

namespace CloudCrafter.Core.Commands.Stacks.Service;

public static class UpdateStackServiceCommand
{
    [Authorize]
    public record Command(
        Guid StackId,
        Guid StackServiceId,
        string? Name = null,
        string? DomainName = null
    ) : IRequest<StackServiceDto?>, IRequireStackAccess;

    public record Handler(IStackServicesService stackServicesService, IGitService GitService)
        : IRequestHandler<Command, StackServiceDto?>
    {
        public async Task<StackServiceDto?> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            var stack = await stackServicesService.UpdateStackService(request);

            return stack;
        }
    }
}
