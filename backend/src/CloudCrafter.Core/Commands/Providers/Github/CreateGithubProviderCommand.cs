using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Providers;
using MediatR;

namespace CloudCrafter.Core.Commands.Providers.Github;

[Authorize]
public record CreateGithubProviderCommand(string Code) : IRequest<bool>;

public class CreateGithubProviderCommandHandler : IRequestHandler<CreateGithubProviderCommand, bool>
{
    private readonly IProvidersService _service;

    public CreateGithubProviderCommandHandler(IProvidersService service)
    {
        _service = service;
    }

    public Task<bool> Handle(
        CreateGithubProviderCommand request,
        CancellationToken cancellationToken
    )
    {
        return _service.CreateGithubProvider(request.Code);
    }
}
