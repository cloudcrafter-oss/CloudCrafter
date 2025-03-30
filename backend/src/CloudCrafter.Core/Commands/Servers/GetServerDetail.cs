using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Domain.Domain.Server;
using MediatR;

namespace CloudCrafter.Core.Commands.Servers;

[Authorize]
public record GetServerDetailQuery(Guid Id) : IRequest<ServerDetailDto?>;

internal class GetServerDetailQueryHandler(IServersService service)
    : IRequestHandler<GetServerDetailQuery, ServerDetailDto?>
{
    public async Task<ServerDetailDto?> Handle(
        GetServerDetailQuery request,
        CancellationToken cancellationToken
    )
    {
        return await service.GetServer(request.Id);
    }
}
