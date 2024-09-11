using Bogus;
using CloudCrafter.Domain.Domain.Application.Services;
using CloudCrafter.Domain.Entities;
using Environment = CloudCrafter.Domain.Entities.Environment;

namespace CloudCrafter.Infrastructure.Data.Fakeds;

public static class FakerInstances
{
    public static Faker<User> UserFaker =>
        new Faker<User>()
            .RuleFor(u => u.Email, f => f.Internet.Email())
            .RuleFor(u => u.UserName, f => f.Internet.UserName())
            .RuleFor(u => u.PasswordHash, f => f.Internet.Password())
            .RuleFor(u => u.FullName, f => f.Person.FullName);

    public static Faker<Server> ServerFaker =>
        new Faker<Server>()
            .StrictMode(true)
            .RuleFor(x => x.Id, Guid.NewGuid)
            .RuleFor(x => x.SshPort, f => f.Random.Number(22, 2000))
            .RuleFor(x => x.Name, f => $"Server {f.Person.FirstName}")
            .RuleFor(x => x.IpAddress, f => f.Internet.Ip())
            .RuleFor(x => x.SshUsername, "root")
            .RuleFor(x => x.SshPrivateKey, f => f.Random.AlphaNumeric(100))
            .RuleFor(x => x.CreatedAt, DateTime.UtcNow)
            .RuleFor(x => x.UpdatedAt, DateTime.UtcNow);

    public static Faker<Project> ProjectFaker =>
        new Faker<Project>()
            .StrictMode(true)
            .RuleFor(x => x.Id, Guid.NewGuid)
            .RuleFor(x => x.Name, f => $"Project {f.Person.FirstName}")
            .RuleFor(x => x.Description, f => f.Lorem.Sentence())
            .RuleFor(x => x.CreatedAt, DateTime.UtcNow)
            .RuleFor(x => x.Environments, new List<Environment>())
            .RuleFor(x => x.UpdatedAt, DateTime.UtcNow);

    public static Faker<EntityHealthStatus> EntityHealthStatusFaker =>
        new Faker<EntityHealthStatus>()
            .StrictMode(true)
            .RuleFor(x => x.Value, f => f.PickRandom<EntityHealthStatusValue>())
            .RuleFor(x => x.StatusAt, DateTime.UtcNow);

    public static StackServiceType StackServiceAppTypeType =>
        new() { Id = StackServiceTypeConstants.App, Type = nameof(StackServiceTypeConstants.App) };

    public static Faker<Stack> StackFaker(Guid environmentId)
    {
        var server = ServerFaker.Generate();
        return new Faker<Stack>()
            .StrictMode(true)
            .RuleFor(x => x.Id, Guid.NewGuid)
            .RuleFor(x => x.Name, f => $"Application {f.Person.FirstName}")
            .RuleFor(x => x.ServerId, server.Id)
            .RuleFor(x => x.BuildPack, f => StackBuildPack.Nixpacks)
            .RuleFor(x => x.CreatedBy, (Guid?)null)
            .RuleFor(x => x.LastModifiedBy, (Guid?)null)
            .RuleFor(x => x.Server, server)
            .RuleFor(x => x.Environment, f => null)
            .RuleFor(x => x.EnvironmentId, environmentId)
            .RuleFor(x => x.Deployments, f => new List<Deployment>())
            .RuleFor(x => x.Source, f => null)
            .RuleFor(x => x.Services, f => new List<StackService>())
            .RuleFor(x => x.CreatedAt, DateTime.UtcNow)
            .RuleFor(x => x.UpdatedAt, DateTime.UtcNow);
    }

    public static Faker<StackService> StackServiceFaker(Stack stack)
    {
        return new Faker<StackService>()
            .StrictMode(true)
            .RuleFor(x => x.Id, Guid.NewGuid)
            .RuleFor(x => x.CreatedAt, DateTime.UtcNow)
            .RuleFor(x => x.UpdatedAt, DateTime.UtcNow)
            .RuleFor(x => x.StackId, stack.Id)
            .RuleFor(x => x.HealthcheckConfiguration, f => new EntityHealthcheckConfiguration())
            .RuleFor(x => x.StackServiceTypeId, Guid.NewGuid) // TODO: Use proper Guid here
            .RuleFor(x => x.Stack, stack)
            .RuleFor(x => x.HttpConfiguration, (EntityHttpConfiguration?)null)
            .RuleFor(x => x.CreatedBy, (Guid?)null)
            .RuleFor(x => x.LastModifiedBy, (Guid?)null)
            .RuleFor(x => x.Name, f => f.Person.FullName)
            .RuleFor(x => x.Type, f => StackServiceAppTypeType)
            .RuleFor(x => x.HealthStatus, f => EntityHealthStatusFaker.Generate());
    }

    public static Faker<Environment> EnvironmentFaker(Project project)
    {
        return new Faker<Environment>()
            .StrictMode(true)
            .RuleFor(x => x.Id, Guid.NewGuid)
            .RuleFor(x => x.Project, f => null)
            .RuleFor(x => x.ProjectId, project.Id)
            .RuleFor(x => x.Name, f => $"Environment {f.Person.FirstName}")
            .RuleFor(x => x.Stacks, f => new List<Stack>())
            .RuleFor(x => x.CreatedAt, DateTime.UtcNow)
            .RuleFor(x => x.UpdatedAt, DateTime.UtcNow);
    }
}
