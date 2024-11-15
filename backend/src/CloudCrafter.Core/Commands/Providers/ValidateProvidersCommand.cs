using CloudCrafter.Core.Interfaces.Domain.Providers;
using MediatR;

namespace CloudCrafter.Core.Commands.Providers;

public static class ValidateProvidersCommand
{
    public record Command : IRequest;

    public class Handler(IProviderValidationService service) : IRequestHandler<Command>
    {
        public Task Handle(Command request, CancellationToken cancellationToken)
        {
            return service.ValidateAll();
        }
    }
}
