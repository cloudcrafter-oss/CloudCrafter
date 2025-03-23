using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Domain.Domain.Server;
using MediatR;

namespace CloudCrafter.Core.Commands.Servers;

[Authorize]
public record GetServerListQuery() : IRequest<List<ServerDto>>;

internal class GetServerListQueryHandler : IRequestHandler<GetServerListQuery, List<ServerDto>>
{
    private readonly IServersService _service;

    public GetServerListQueryHandler(IServersService service)
    {
        _service = service;
    }

    public async Task<List<ServerDto>> Handle(
        GetServerListQuery request,
        CancellationToken cancellationToken
    )
    {
        return await _service.GetServers();
    }
}
