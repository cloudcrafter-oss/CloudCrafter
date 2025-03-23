using CloudCrafter.Core.Commands.Servers;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace CloudCrafter.Core.Jobs.Servers;

public class MarkServersUnknownAfterTimespanJob : ISimpleJob
{
    public Task HandleAsync(IServiceProvider serviceProvider)
    {
        var sender = serviceProvider.GetRequiredService<ISender>();

        return sender.Send(new MarkServersAsUnknownAfterTimespanCommand());
    }
}
