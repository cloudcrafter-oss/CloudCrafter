using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Domain.Constants;
using CloudCrafter.Domain.Domain.User.ACL;
using MediatR;

namespace CloudCrafter.Core.Common.Behaviours;

public class AccessTeamBehaviour<TRequest, TResponse>(
    IIdentityService identityService,
    IUser user,
    IUserAccessService userAccessService
) : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken
    )
    {
        if (request is not IRequireTeamWriteAccess teamAccessRequest)
        {
            return await next();
        }

        if (user.Id == null)
        {
            throw new UnauthorizedAccessException();
        }

        var teamId = teamAccessRequest.TeamId;

        // only admin can create without team id
        var isAdmin = await identityService.IsInRoleAsync(user.Id.Value, Roles.Administrator);

        if (isAdmin)
        {
            return await next();
        }

        if (teamId == null)
        {
            throw new ForbiddenAccessException();
        }

        var canAccess = await userAccessService.HasAccessToTeam(
            user.Id.Value,
            teamId.Value,
            AccessType.Write
        );

        if (!canAccess)
        {
            throw new ForbiddenAccessException();
        }

        return await next();
    }
}
