using CloudCrafter.Core.Commands.Providers.Github;
using CloudCrafter.Domain.Domain.Providers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CloudCrafter.Web.Controllers;

public class ProvidersController : CloudCrafterController
{
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [HttpPost]
    public async Task<IResult> PostCreateGithubApp(
        ISender sender,
        CreateGithubProviderCommand command
    )
    {
        var created = await sender.Send(command);

        return created ? Results.Created() : Results.BadRequest();
    }

    [HttpGet]
    public async Task<List<SourceProviderDto>> GetProviders(
        ISender sender,
        [FromQuery] ProviderFilterRequest filter
    )
    {
        var result = await sender.Send(new GetProvidersQuery.Query(filter));

        return result;
    }

    [HttpPut("github/{id}/install")]
    public async Task<IResult> PutUpdateGithubProvider(
        ISender sender,
        [FromRoute] Guid id,
        [FromBody] UpdateGithubInstallationRequest request
    )
    {
        await sender.Send(new UpdateGithubInstallationCommand(request, id));

        return Results.Ok();
    }

    [HttpGet("{id}/repositories")]
    public async Task<List<GitProviderRepositoryDto>> GetGitRepositories(
        ISender sender,
        [FromRoute] Guid id
    )
    {
        return await sender.Send(new GetGitRepositoriesQuery(id));
    }

    [HttpGet("{id}/branches/{repositoryId}")]
    public async Task<List<GitProviderBranchDto>> GetGitBranches(
        ISender sender,
        [FromRoute] Guid id,
        [FromRoute] string repositoryId
    )
    {
        return await sender.Send(new GetGitBranchesQuery(id, repositoryId));
    }

    [HttpDelete("{id}")]
    public async Task<IResult> DeleteProvider(ISender sender, [FromRoute] Guid id)
    {
        await sender.Send(new DeleteProviderCommand(id));

        return Results.Ok();
    }
}
