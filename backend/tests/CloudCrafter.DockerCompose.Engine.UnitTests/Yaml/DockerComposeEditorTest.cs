using System.Text;
using CloudCrafter.DockerCompose.Engine.Exceptions;
using CloudCrafter.DockerCompose.Engine.Yaml;
using FluentAssertions;

namespace CloudCrafter.DockerCompose.Engine.UnitTests.Yaml;

[TestFixture]
public class DockerComposeEditorTest
{
    [SetUp]
    public void Setup()
    {
        _editor = new DockerComposeEditor(yamlString);
    }

    private readonly string yamlString =
        @"
version: '3.8'
services:
  web:
    image: php:7.4-apache
    ports:
      - ""80:80""
    volumes:
      - ./php-app:/var/www/html
    networks:
      - lampnet
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: example
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - lampnet

volumes:
  db_data:

#dummy
networks:
  lampnet:
";

    private DockerComposeEditor _editor;

    [Test]
    public void ShouldBeAbleToFetchDbService()
    {
        var db = _editor.Service("db");
        db.Should().NotBeNull();
    }

    [Test]
    public void ShouldNotBeAbleToFetchNonExistingService()
    {
        var ex = Assert.Throws<InvalidServiceException>(
            () => _editor.Service("nonExistingService")
        );

        ex.Message.Should().Be("Service nonExistingService is invalid");
    }

    [Test]
    public void ShouldNotBeAbleToAddExistingService()
    {
        var ex = Assert.Throws<ServiceAlreadyExistsException>(() => _editor.AddService("db"));

        ex.Message.Should().Be("Service db already exists");
    }

    [Test]
    public async Task ShouldBeAbleToGetBaseYaml()
    {
        var yaml = _editor.GetYaml();
        var isValid = await _editor.IsValid();

        isValid.IsValid.Should().BeTrue();

        await Verify(yaml);
    }

    [Test]
    public async Task ShouldBeAbleToAddALabel()
    {
        var service = _editor.Service("web")!.AddLabel("treafik.enable", "true");

        var yaml = _editor.GetYaml();

        var isValid = await _editor.IsValid();

        isValid.IsValid.Should().BeTrue();

        await Verify(yaml);
    }

    [Test]
    public async Task ShouldBeAbleToAddEnvironmentVariable()
    {
        var service = _editor.Service("web")!.AddEnvironmentVariable("APP_ENV", "dev");

        var yaml = _editor.GetYaml();

        var isValid = await _editor.IsValid();

        isValid.IsValid.Should().BeTrue();

        await Verify(yaml);
    }

    [Test]
    public async Task ShouldBeAbleToAddVolume()
    {
        var service = _editor.Service("web")!.AddVolume("./cache", "/var/www/html/cache");

        var yaml = _editor.GetYaml();

        var isValid = await _editor.IsValid();

        isValid.IsValid.Should().BeTrue();

        await Verify(yaml);
    }

    [Test]
    public async Task ShouldBeAbleToAddService()
    {
        var service = _editor.AddService("newService");
        service.AddEnvironmentVariable("newKey", "newValue");
        service.AddVolume("/newVolume", "/newPath");
        service.SetImage("nginx", "latest");

        var yaml = _editor.GetYaml();

        var isValid = await _editor.IsValid();

        isValid.IsValid.Should().BeTrue();

        await Verify(yaml);
    }

    [Test]
    public async Task ShouldBeAbleToAddServiceAndEditExistingOne()
    {
        var service = _editor.AddService("newService");
        service.AddEnvironmentVariable("newKey", "newValue");
        service.AddVolume("/newVolume", "/newPath");
        service.SetImage("nginx", "latest");

        var dbService = _editor.Service("db");
        dbService.AddEnvironmentVariable("newKey", "newValue");

        var yaml = _editor.GetYaml();

        var isValid = await _editor.IsValid();

        isValid.IsValid.Should().BeTrue();

        await Verify(yaml);
    }

    [Test]
    public async Task ShouldBeAbleToChangeServiceImage()
    {
        var service = _editor.Service("web")!;
        service.SetImage("php", "8.0-apache");

        var yaml = _editor.GetYaml();

        var isValid = await _editor.IsValid();

        isValid.IsValid.Should().BeTrue();

        await Verify(yaml);
    }

    [Test]
    public void ShouldBeAbleToListServices()
    {
        var services = _editor.Services();

        services.Should().HaveCount(2);
        services.Should().Contain("web");
        services.Should().Contain("db");
    }

    [Test]
    public async Task ShouldBeAbleToAddNetwork()
    {
        var network = _editor.AddNetwork("mynetwork");
        network.SetNetworkName("mynetwork");

        var database = _editor.Service("db");
        database.AddNetwork(network);

        var yaml = _editor.GetYaml();

        var isValid = await _editor.IsValid();

        isValid.IsValid.Should().BeTrue();

        await Verify(yaml);
    }

    [Test]
    public async Task ShouldBeAbleToAddPortsToServiceWhichHasExistingPorts()
    {
        var service = _editor.Service("web");

        service.AddExposedPort(443, 443);

        var isValid = await _editor.IsValid();

        isValid.Should().Be(true);

        var yaml = _editor.GetYaml();

        await Verify(yaml);
    }

    [Test]
    public async Task ShouldBeAbleToAddPortsToServiceWhichHasNoExistingPorts()
    {
        var service = _editor.Service("db");

        service.AddExposedPort(3306, 3306);
        service.AddExposedPort(3307, 3307);
        var isValid = await _editor.IsValid();

        isValid.Should().Be(true);

        var yaml = _editor.GetYaml();

        await Verify(yaml);
    }

    [Test]
    public async Task ShouldBeAbleToRetrieveBase64EncodedYaml()
    {
        var base64 = _editor.ToBase64();
        await Verify(base64);

        // Decode base64
        var decodedBase64 = Encoding.UTF8.GetString(Convert.FromBase64String(base64));
        decodedBase64.Should().Be(_editor.GetYaml());
    }
}
