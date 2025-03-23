using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Providers;
using MediatR;

namespace CloudCrafter.Core.Commands.Providers.Github;

[Authorize]
public record DeleteProviderCommand(Guid ProviderId) : IRequest;

public class DeleteProviderCommandHandler : IRequestHandler<DeleteProviderCommand>
{
    private readonly IProvidersService _service;

    public DeleteProviderCommandHandler(IProvidersService service)
    {
        _service = service;
    }

    public Task Handle(DeleteProviderCommand request, CancellationToken cancellationToken)
    {
        return _service.DeleteProvider(request.ProviderId);
    }
}
