using CloudCrafter.Core.Domain.Auth;
using CloudCrafter.UseCases.Domain.Auth.Services;
using MediatR;

namespace CloudCrafter.UseCases.Domain.Auth.Commands;

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
