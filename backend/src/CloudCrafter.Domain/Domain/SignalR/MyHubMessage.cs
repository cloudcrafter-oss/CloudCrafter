using TypeGen.Core.TypeAnnotations;

namespace CloudCrafter.Domain.Domain.SignalR;

[ExportTsClass]
public class MyHubMessage
{
    public Guid Id { get; init; }
}
