using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;

namespace CloudCrafter.TestUtilities;

[SetUpFixture]
public class SharedDockerTestHostSetup
{
    public static IContainer? _container { get; private set; }
    public static string? DockerFileLocation { get; private set; }

    private string GetSolutionDirectory()
    {
        var directory = new DirectoryInfo(Directory.GetCurrentDirectory());
        while (directory != null && !directory.GetFiles("*.sln").Any())
        {
            directory = directory.Parent;
        }

        return directory?.FullName
            ?? throw new DirectoryNotFoundException("Solution directory not found.");
    }

    [OneTimeSetUp]
    public async Task Setup()
    {
        var solutionDirectory = GetSolutionDirectory();

        var dockerfileDirectory = Path.Combine(solutionDirectory, "..", "docker", "test-host");
        DockerFileLocation = dockerfileDirectory;

        // Define and start the container
        var futureImage = new ImageFromDockerfileBuilder()
            .WithDockerfileDirectory(dockerfileDirectory)
            .WithDockerfile("Dockerfile")
            .Build();

        await futureImage.CreateAsync().ConfigureAwait(false);

        _container = new ContainerBuilder()
            .WithImage(futureImage)
            .WithPortBinding(2222, 22)
            .WithWaitStrategy(Wait.ForUnixContainer().UntilPortIsAvailable(22))
            .Build();

        await _container.StartAsync().ConfigureAwait(false);
    }

    [OneTimeTearDown]
    public async Task GlobalTeardown()
    {
        if (_container == null)
        {
            return;
        }

        await _container.StopAsync().ConfigureAwait(false);
        await _container.DisposeAsync().ConfigureAwait(false);
    }
}
