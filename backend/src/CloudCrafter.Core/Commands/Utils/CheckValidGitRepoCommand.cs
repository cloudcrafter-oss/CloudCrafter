using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Utils;
using CloudCrafter.Domain.Domain.Utils;
using MediatR;

namespace CloudCrafter.Core.Commands.Utils;

// [Authorize]
// TODO: Add Authorize
public record CheckValidGitRepoCommand(string Repository) : IRequest<GitRepositoryCheckResultDto>;

internal class CheckValidGitRepoCommandHandler
    : IRequestHandler<CheckValidGitRepoCommand, GitRepositoryCheckResultDto>
{
    private readonly IGitService _service;

    public CheckValidGitRepoCommandHandler(IGitService service)
    {
        _service = service;
    }

    public Task<GitRepositoryCheckResultDto> Handle(
        CheckValidGitRepoCommand request,
        CancellationToken cancellationToken
    )
    {
        return _service.ValidateRepository(request.Repository);
    }
}
