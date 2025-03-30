using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Utils;
using CloudCrafter.Domain.Domain.Utils;
using MediatR;

namespace CloudCrafter.Core.Commands.Utils;

[Authorize]
// TODO: Add Authorize
public record CheckValidGitRepoCommand(string Repository) : IRequest<GitRepositoryCheckResultDto>;

internal class CheckValidGitRepoCommandHandler(IGitService service)
    : IRequestHandler<CheckValidGitRepoCommand, GitRepositoryCheckResultDto>
{
    public Task<GitRepositoryCheckResultDto> Handle(
        CheckValidGitRepoCommand request,
        CancellationToken cancellationToken
    )
    {
        return service.ValidateRepository(request.Repository);
    }
}
