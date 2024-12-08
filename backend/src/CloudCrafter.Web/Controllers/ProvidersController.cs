﻿using CloudCrafter.Core.Commands.Providers.Github;
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
        CreateGithubProviderCommand.Command command
    )
    {
        var created = await sender.Send(command);

        return created ? Results.Created() : Results.BadRequest();
    }

    [HttpGet]
    public async Task<ProviderOverviewDto> GetProviders(
        ISender sender,
        [FromQuery] ProviderFilterRequest filter
    )
    {
        return await sender.Send(new GetProvidersQuery.Query(filter));
    }

    [HttpPut("github/{id}/install")]
    public async Task<IResult> PutUpdateGithubProvider(
        ISender sender,
        [FromRoute] Guid id,
        [FromBody] UpdateGithubInstallationCommand.Request request
    )
    {
        await sender.Send(new UpdateGithubInstallationCommand.Command(request, id));

        return Results.Ok();
    }

    [HttpGet("github/{id}/repositories")]
    public async Task<List<GitProviderRepositoryDto>> GetGithubRepositories(
        ISender sender,
        [FromRoute] Guid id
    )
    {
        return await sender.Send(new GetGithubRepositoriesQuery.Query(id));
    }
}