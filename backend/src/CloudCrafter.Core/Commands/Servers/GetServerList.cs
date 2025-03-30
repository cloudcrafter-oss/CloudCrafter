using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Domain.Domain.Server;
using MediatR;

namespace CloudCrafter.Core.Commands.Servers;

[Authorize]
public record GetServerListQuery : IRequest<List<ServerDto>>;

internal class GetServerListQueryHandler(IServersService service)
    : IRequestHandler<GetServerListQuery, List<ServerDto>>
{
    public async Task<List<ServerDto>> Handle(
        GetServerListQuery request,
        CancellationToken cancellationToken
    )
    {
        return await service.GetServers();
    }
}
