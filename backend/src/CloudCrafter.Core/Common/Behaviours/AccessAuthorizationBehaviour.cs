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
        if (user.Id is null)
        {
            throw new UnauthorizedAccessException("User is not authenticated");
        }

        if (request is IRequireServerAccess serverAccessRequest)
        {
            var exception =
                new UnauthorizedAccessException($"User does not have access to server {serverAccessRequest.ServerId}");

            var hasAccess = await accessService.CanAccessServer(user.Id.Value, serverAccessRequest.ServerId);

            if (!hasAccess)
            {
                throw exception;
            }
        }

        if (request is IRequireEnvironmentAccess environmentAccessRequest)
        {
            var exception =
                new UnauthorizedAccessException(
                    $"User does not have access to environment {environmentAccessRequest.EnvironmentId}");

            var hasAccess =
                await accessService.CanAccessEnvironment(user.Id.Value, environmentAccessRequest.EnvironmentId);

            if (!hasAccess)
            {
                throw exception;
            }
        }

        return await next();
    }
}
