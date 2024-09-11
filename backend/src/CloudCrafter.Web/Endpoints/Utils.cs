using CloudCrafter.Core.Commands.Utils;
using CloudCrafter.Domain.Domain.Utils;
using CloudCrafter.Web.Infrastructure;
using MediatR;

namespace CloudCrafter.Web.Endpoints;

public class Utils : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this).MapPost(PostValidateGithubRepo, "validate-git-repository");
    }

    public Task<GitRepositoryCheckResultDto> PostValidateGithubRepo(
        CheckValidGitRepoCommand.Command command,
        ISender sender
    )
    {
        return sender.Send(command);
    }
}
