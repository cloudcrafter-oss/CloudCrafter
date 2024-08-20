using CloudCrafter.Core.Common.Interfaces;

namespace CloudCrafter.Worker.Console.Common;

public class NullUser : IUser
{
    public Guid? Id { get; } = null;
}
