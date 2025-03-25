using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Providers;
using MediatR;

namespace CloudCrafter.Core.Commands.Providers.Github;

public record UpdateGithubInstallationRequest(long InstallationId);

[Authorize]
public record UpdateGithubInstallationCommand(
    UpdateGithubInstallationRequest Request,
    Guid GithubProviderId
) : IRequest;

public class UpdateGithubInstallationCommandHandler(IProvidersService service)
    : IRequestHandler<UpdateGithubInstallationCommand>
{
    public Task Handle(UpdateGithubInstallationCommand request, CancellationToken cancellationToken)
    {
        return service.InstallGithubProvider(
            request.GithubProviderId,
            request.Request.InstallationId
        );
    }
}
