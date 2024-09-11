using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Domain.Domain.Server;
using MediatR;

namespace CloudCrafter.Core.Commands.Servers;

public static class GetServerList
{
    [Authorize]
    public record Query() : IRequest<List<ServerDto>>;

    private class Handler(IServersService service) : IRequestHandler<Query, List<ServerDto>>
    {
        public async Task<List<ServerDto>> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            return await service.GetServers();
        }
    }
}
