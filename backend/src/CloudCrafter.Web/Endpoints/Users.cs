using CloudCrafter.Core.Commands.Users;
using CloudCrafter.Core.Common.Responses;
using CloudCrafter.Domain.Common.Pagination;
using CloudCrafter.Domain.Domain.User;
using CloudCrafter.Domain.Requests.Filtering;
using CloudCrafter.Web.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;

namespace CloudCrafter.Web.Endpoints;

public class Users : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this).MapPost(GetUsers).MapGet(Test, "test");
    }

    public async Task<PaginatedList<UserDto>> GetUsers(
        ISender sender,
        [FromBody] PaginatedRequest<UserDto> paginationRequest
    )
    {
        return await sender.Send(new GetUserList.Query(paginationRequest));
    }

    public List<string> Test()
    {
        return new List<string>() { "test1", "test2" };
    }
}
