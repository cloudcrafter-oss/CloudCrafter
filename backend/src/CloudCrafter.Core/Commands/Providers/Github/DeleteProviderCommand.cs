using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Providers;
using MediatR;

namespace CloudCrafter.Core.Commands.Providers.Github;

[Authorize]
public record DeleteProviderCommand(Guid ProviderId) : IRequest;

public class DeleteProviderCommandHandler(IProvidersService service)
    : IRequestHandler<DeleteProviderCommand>
{
    public Task Handle(DeleteProviderCommand request, CancellationToken cancellationToken)
    {
        return service.DeleteProvider(request.ProviderId);
    }
}
