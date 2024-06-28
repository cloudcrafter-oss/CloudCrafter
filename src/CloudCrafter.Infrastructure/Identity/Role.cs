using Ardalis.SharedKernel;
using Microsoft.AspNetCore.Identity;

namespace CloudCrafter.Infrastructure.Identity;

public class Role : IdentityRole<Guid>, IAggregateRoot
{
}
