using CloudCrafter.Core.Interfaces.Domain.Providers;
using MediatR;

namespace CloudCrafter.Core.Commands.Providers;

public record ValidateAllProvidersCommand : IRequest;

public class ValidateAllProvidersCommandHandler : IRequestHandler<ValidateAllProvidersCommand>
{
    private readonly IProviderValidationService _service;

    public ValidateAllProvidersCommandHandler(IProviderValidationService service)
    {
        _service = service;
    }

    public Task Handle(ValidateAllProvidersCommand request, CancellationToken cancellationToken)
    {
        return _service.ValidateAll();
    }
}
