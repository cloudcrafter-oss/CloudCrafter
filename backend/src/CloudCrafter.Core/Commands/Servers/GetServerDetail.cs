using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Domain.Domain.Server;
using MediatR;

namespace CloudCrafter.Core.Commands.Servers;

[Authorize]
public record GetServerDetailQuery(Guid Id) : IRequest<ServerDetailDto?>;

internal class GetServerDetailQueryHandler : IRequestHandler<GetServerDetailQuery, ServerDetailDto?>
{
    private readonly IServersService _service;

    public GetServerDetailQueryHandler(IServersService service)
    {
        _service = service;
    }

    public async Task<ServerDetailDto?> Handle(
        GetServerDetailQuery request,
        CancellationToken cancellationToken
    )
    {
        return await _service.GetServer(request.Id);
    }
}
