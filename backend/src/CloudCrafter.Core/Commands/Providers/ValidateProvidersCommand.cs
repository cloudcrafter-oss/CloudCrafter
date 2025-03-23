using CloudCrafter.Core.Interfaces.Domain.Providers;
using MediatR;

namespace CloudCrafter.Core.Commands.Providers;

public record ValidateAllProvidersCommand : IRequest;

public class ValidateAllProvidersCommandHandler(IProviderValidationService service)
    : IRequestHandler<ValidateAllProvidersCommand>
{
    public Task Handle(ValidateAllProvidersCommand request, CancellationToken cancellationToken)
    {
        return service.ValidateAll();
    }
}
