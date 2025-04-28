using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Auth;
using CloudCrafter.Domain.Domain.User;
using MediatR;

namespace CloudCrafter.Core.Commands.Users;

[Authorize]
public class GetCurrentUserRolesQuery : IRequest<List<RoleDto>> { }

internal class GetCurrentUserRolesQueryHandler(ICloudCrafterAuthService authService, IUser user)
    : IRequestHandler<GetCurrentUserRolesQuery, List<RoleDto>>
{
    public async Task<List<RoleDto>> Handle(
        GetCurrentUserRolesQuery request,
        CancellationToken cancellationToken
    )
    {
        if (user?.Id == null)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        return await authService.GetRoles(user.Id.Value);
    }
}
