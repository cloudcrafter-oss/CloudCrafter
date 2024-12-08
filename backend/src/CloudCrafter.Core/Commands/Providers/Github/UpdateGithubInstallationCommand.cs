using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Providers;
using MediatR;

namespace CloudCrafter.Core.Commands.Providers.Github;

public static class UpdateGithubInstallationCommand
{
    public record Request(long InstallationId);

    [Authorize]
    public record Command(Request Request, Guid GithubProviderId) : IRequest;

    public class Handler(IProvidersService service) : IRequestHandler<Command>
    {
        public Task Handle(Command request, CancellationToken cancellationToken)
        {
            return service.InstallGithubProvider(
                request.GithubProviderId,
                request.Request.InstallationId
            );
        }
    }
}
