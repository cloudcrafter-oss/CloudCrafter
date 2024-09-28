using Bogus;
using CloudCrafter.Domain.Entities;
using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;
using Hangfire;
using Hangfire.States;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests;

using static Testing;

[TestFixture]
public abstract class BaseTestFixture
{
    [SetUp]
    public async Task TestSetUp()
    {
        await ResetState();
    }

    [TearDown]
    public async Task TesTearDown()
    {
        if (TestingHostContainer != null)
        {
            await TestingHostContainer.StopAsync().ConfigureAwait(false);

            await TestingHostContainer.DisposeAsync().ConfigureAwait(false);
        }
    }

    public int TestingHostPort;
    private IContainer? TestingHostContainer;

    public Faker<Server> TestingHostServerFaker()
    {
        var sshKeyContents = File.ReadLines(GetDockerfileDirectory() + "/id_rsa");

        var sshKey = string.Join("\n", sshKeyContents);

        return new Faker<Server>()
            .StrictMode(true)
            .RuleFor(x => x.Id, Guid.NewGuid)
            .RuleFor(x => x.SshPort, f => TestingHostPort)
            .RuleFor(x => x.Name, f => $"Server {f.Person.FirstName}")
            .RuleFor(x => x.IpAddress, "127.0.0.1")
            .RuleFor(x => x.SshUsername, "root")
            .RuleFor(x => x.SshPrivateKey, sshKey)
            .RuleFor(x => x.DockerDataDirectoryMount, "/data/cloudcrafter")
            .RuleFor(x => x.AgentSecretKey, f => f.Internet.Password(16))
            .RuleFor(x => x.CreatedAt, DateTime.UtcNow)
            .RuleFor(x => x.UpdatedAt, DateTime.UtcNow);
    }

    public async Task StartTestingHost()
    {
        var dockerfileDirectory = GetDockerfileDirectory();

        var testingHostImage = new ImageFromDockerfileBuilder()
            .WithDockerfileDirectory(dockerfileDirectory)
            .WithDockerfile("Dockerfile")
            .Build();

        var faker = new Faker();
        TestingHostPort = faker.Random.Number(3000, 4000);
        await testingHostImage.CreateAsync().ConfigureAwait(false);

        TestingHostContainer = new ContainerBuilder()
            .WithImage(testingHostImage)
            .WithPortBinding(TestingHostPort, 22)
            .WithWaitStrategy(Wait.ForUnixContainer().UntilPortIsAvailable(22))
            .Build();

        await TestingHostContainer.StartAsync().ConfigureAwait(false);
    }

    public void WaitForJobCompletion(string jobId, int timeoutInSeconds = 30)
    {
        var startTime = DateTime.Now;
        using (var connection = JobStorage.Current.GetConnection())
        {
            while (true)
            {
                var jobData = connection.GetJobData(jobId);
                if (jobData.State == SucceededState.StateName)
                {
                    return;
                }

                if ((DateTime.Now - startTime).TotalSeconds > timeoutInSeconds)
                {
                    throw new TimeoutException(
                        $"Job {jobId} did not complete within the timeout period."
                    );
                }

                Thread.Sleep(500); // Check every 500 milliseconds
            }
        }
    }
}
