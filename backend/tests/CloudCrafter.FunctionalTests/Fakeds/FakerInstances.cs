using Bogus;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Identity;

namespace CloudCrafter.FunctionalTests.Fakeds;

public static class FakerInstances
{
    public static Faker<User> UserFaker => new Faker<User>()
        .RuleFor(u => u.Email, f => f.Internet.Email())
        .RuleFor(u => u.UserName, f => f.Internet.UserName())
        .RuleFor(u => u.PasswordHash, f => f.Internet.Password())
        .RuleFor(u => u.FullName, f => f.Person.FullName);
}
