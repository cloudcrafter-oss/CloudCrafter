using Ardalis.SharedKernel;
using Microsoft.AspNetCore.Identity;

namespace CloudCrafter.Infrastructure.Identity;

public class User : IdentityUser<Guid>, IAggregateRoot
{
    public bool IsActive { get; set; } = true;
}
