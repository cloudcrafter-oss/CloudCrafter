using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Providers;
using MediatR;

namespace CloudCrafter.Core.Commands.Providers.Github;

[Authorize]
public record CreateGithubProviderCommand(string Code) : IRequest<bool>;

public class CreateGithubProviderCommandHandler(IProvidersService service)
    : IRequestHandler<CreateGithubProviderCommand, bool>
{
    public Task<bool> Handle(
        CreateGithubProviderCommand request,
        CancellationToken cancellationToken
    )
    {
        return service.CreateGithubProvider(request.Code);
    }
}
