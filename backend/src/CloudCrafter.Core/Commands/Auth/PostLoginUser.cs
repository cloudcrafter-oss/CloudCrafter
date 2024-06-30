
using CloudCrafter.Core.Interfaces.Domain.Auth;
using CloudCrafter.Domain.Domain.Auth;
using MediatR;

namespace CloudCrafter.Core.Commands.Auth;

public static class PostLoginUser
{
    public record Query(string Email, string Password) : IRequest<TokenDto>;

    private class Handler(ICloudCrafterAuthService service) : IRequestHandler<Query, TokenDto>
    {
        public async Task<TokenDto> Handle(Query request, CancellationToken cancellationToken)
        {
            return await service.LoginAsync(request.Email, request.Password);
        }
    }
}
