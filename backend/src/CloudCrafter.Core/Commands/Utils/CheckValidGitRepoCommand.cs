using CloudCrafter.Core.Interfaces.Domain.Utils;
using CloudCrafter.Domain.Domain.Utils;
using MediatR;

namespace CloudCrafter.Core.Commands.Utils;

public static class CheckValidGitRepoCommand
{
    public record Command(string Repository) : IRequest<GitRepositoryCheckResultDto>;

    private class Handler(IGitService service)
        : IRequestHandler<Command, GitRepositoryCheckResultDto>
    {
        public Task<GitRepositoryCheckResultDto> Handle(
            Command request,
            CancellationToken cancellationToken
        )
        {
            return service.ValidateRepository(request.Repository);
        }
    }
}
