using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Domain.Domain.Server;
using MediatR;

namespace CloudCrafter.Core.Commands.Servers;

public static class GetServerDetail
{
    [Authorize]
    public record Query(Guid Id) : IRequest<ServerDetailDto?>;

    private class Handler(IServersService service) : IRequestHandler<Query, ServerDetailDto?>
    {
        public async Task<ServerDetailDto?> Handle(
            Query request,
            CancellationToken cancellationToken
        )
        {
            return await service.GetServer(request.Id);
        }
    }
}
