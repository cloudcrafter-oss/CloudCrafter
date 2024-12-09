using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Providers;
using MediatR;

namespace CloudCrafter.Core.Commands.Providers.Github;

public static class DeleteProviderCommand
{
    [Authorize]
    public record Command(Guid ProviderId) : IRequest;

    public class Handler(IProvidersService service) : IRequestHandler<Command>
    {
        public Task Handle(Command request, CancellationToken cancellationToken)
        {
            return service.DeleteProvider(request.ProviderId);
        }
    }
}
