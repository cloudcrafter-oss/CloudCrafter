using CloudCrafter.UseCases.Domain.Auth.Services;
using MediatR;

namespace CloudCrafter.UseCases.Domain.Auth.Commands;

public static class PostLoginUser
{
    public record Query(string Email, string Password) : IRequest;

    private class Handler(ICloudCrafterAuthService service) : IRequestHandler<Query>
    {
        public async Task Handle(Query request, CancellationToken cancellationToken)
        {
            await service.LoginAsync(request.Email, request.Password);
        }
    }
}
