using Ardalis.SharedKernel;
using Microsoft.AspNetCore.Identity;

namespace CloudCrafter.Domain.Entities;

public class Role : IdentityRole<Guid>, IAggregateRoot
{
}
