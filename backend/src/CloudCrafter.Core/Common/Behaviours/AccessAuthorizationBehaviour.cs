using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Common.Interfaces.Access;
using CloudCrafter.Core.Interfaces.Domain.Users;
using MediatR;

namespace CloudCrafter.Core.Common.Behaviours;

public class ServerAccessAuthorizationBehavior<TRequest, TResponse>(IUser user, IUserAccessService accessService)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        await CheckAccess<IRequireServerAccess>(request,
            (r, id) => accessService.CanAccessServer(id, r.ServerId),
            r => $"User does not have access to server {r.ServerId}");

        await CheckAccess<IRequireEnvironmentAccess>(request,
            (r, id) => accessService.CanAccessEnvironment(id, r.EnvironmentId),
            r => $"User does not have access to environment {r.EnvironmentId}");

        await CheckAccess<IRequireProjectAccess>(request,
            (r, id) => accessService.CanAccessProject(id, r.ProjectId),
            r => $"User does not have access to project {r.ProjectId}");

        await CheckAccess<IRequireStackAccess>(request,
            (r, id) => accessService.CanAccessStack(id, r.StackId),
            r => $"User does not have access to stack {r.StackId}");

        return await next();
    }

    private async Task CheckAccess<TAccessRequest>(
        TRequest request,
        Func<TAccessRequest, Guid, Task<bool>> accessCheck,
        Func<TAccessRequest, string> exceptionMessageFactory)
        where TAccessRequest : class
    {
        if (request is TAccessRequest accessRequest)
        {
            if (user.Id is null)
            {
                throw new UnauthorizedAccessException("User is not authenticated");
            }

            var hasAccess = await accessCheck(accessRequest, user.Id.Value);

            if (!hasAccess)
            {
                throw new UnauthorizedAccessException(exceptionMessageFactory(accessRequest));
            }
        }
    }
}
