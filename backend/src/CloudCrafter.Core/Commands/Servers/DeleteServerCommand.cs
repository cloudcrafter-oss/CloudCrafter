﻿using CloudCrafter.Core.Common.Security;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using MediatR;

namespace CloudCrafter.Core.Commands.Servers;

public static class DeleteServerCommand
{
    [Authorize]
    public record Command(Guid ServerId) : IRequest;

    private class Handler(IServersService service) : IRequestHandler<Command>
    {
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            await service.DeleteServer(request.ServerId);
        }
    }
}
