using CloudCrafter.Core.Interfaces.Domain.Auth;
using CloudCrafter.Domain.Domain.Auth;
using MediatR;

namespace CloudCrafter.Core.Commands.Auth;

public record CreateUserCommand(string Email, string Name) : IRequest<TokenDto>;

public class CreateUserCommandHandler(ICloudCrafterAuthService service)
    : IRequestHandler<CreateUserCommand, TokenDto>
{
    public async Task<TokenDto> Handle(
        CreateUserCommand request,
        CancellationToken cancellationToken
    )
    {
        return await service.CreateUserAsync(request.Email, request.Name);
    }
}
