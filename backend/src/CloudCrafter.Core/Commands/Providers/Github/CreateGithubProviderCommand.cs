using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Providers;
using MediatR;

namespace CloudCrafter.Core.Commands.Providers.Github;

public static class CreateGithubProviderCommand
{
    [Authorize]
    public record Command(string Code) : IRequest<bool>;

    public class Handler(IProvidersService service) : IRequestHandler<Command, bool>
    {
        public Task<bool> Handle(Command request, CancellationToken cancellationToken)
        {
            return service.CreateGithubProvider(request.Code);
        }
    }
}
