using CloudCrafter.Core.Commands.Users;
using CloudCrafter.Domain.Domain.User;
using CloudCrafter.Web.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace CloudCrafter.Web.Endpoints;

public class Users : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapGet(GetUsers)
            .MapGet(Test, "test");
    }
    
    public async Task<List<UserDto>> GetUsers(ISender sender)
    {
        return await sender.Send(new GetUserList.Query());
    }

    public List<string> Test()
    {
        return new List<string>() { "test1", "test2" };
    }
}
