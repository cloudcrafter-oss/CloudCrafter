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

public class UpdateGithubInstallationCommandHandler
    : IRequestHandler<UpdateGithubInstallationCommand>
{
    private readonly IProvidersService _service;

    public UpdateGithubInstallationCommandHandler(IProvidersService service)
    {
        _service = service;
    }

    public Task Handle(UpdateGithubInstallationCommand request, CancellationToken cancellationToken)
    {
        return _service.InstallGithubProvider(
            request.GithubProviderId,
            request.Request.InstallationId
        );
    }
}
