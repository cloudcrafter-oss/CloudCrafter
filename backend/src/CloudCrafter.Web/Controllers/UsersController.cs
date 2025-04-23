using CloudCrafter.Core.Commands.Users;
using CloudCrafter.Core.Common.Responses;
using CloudCrafter.Domain.Common.Pagination;
using CloudCrafter.Domain.Domain.User;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CloudCrafter.Web.Controllers;

public class UsersController : CloudCrafterController
{
    [HttpGet]
    public async Task<PaginatedList<UserDto>> GetUsers(
        ISender sender,
        [FromQuery] PaginatedRequest paginationRequest
    )
    {
        return await sender.Send(new GetUserListQuery(paginationRequest));
    }

    [HttpGet]
    public async Task<List<RoleDto>> GetUserRoles(ISender sender)
    {
        return await sender.Send(new GetCurrentUserRolesQuery());
    }
}
