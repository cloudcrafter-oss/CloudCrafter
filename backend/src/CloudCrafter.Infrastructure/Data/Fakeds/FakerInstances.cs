using Bogus;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Identity;

namespace CloudCrafter.Infrastructure.Data.Fakeds;

public static class FakerInstances
{
    public static Faker<User> UserFaker => new Faker<User>()
        .RuleFor(u => u.Email, f => f.Internet.Email())
        .RuleFor(u => u.UserName, f => f.Internet.UserName())
        .RuleFor(u => u.PasswordHash, f => f.Internet.Password())
        .RuleFor(u => u.FullName, f => f.Person.FullName);

    public static Faker<Server> ServerFaker => new Faker<Server>()
        .StrictMode(true)
        .RuleFor(x => x.Id, Guid.NewGuid)
        .RuleFor(x => x.Name, f => $"Server {f.Person.FirstName}")
        .RuleFor(x => x.IpAddress, f => f.Internet.Ip())
        .RuleFor(x => x.SshUsername, "root")
        .RuleFor(x => x.SshPrivateKey, f => f.Random.AlphaNumeric(100))
        .RuleFor(x => x.CreatedAt, DateTime.UtcNow)
        .RuleFor(x => x.UpdatedAt, DateTime.UtcNow);

}
