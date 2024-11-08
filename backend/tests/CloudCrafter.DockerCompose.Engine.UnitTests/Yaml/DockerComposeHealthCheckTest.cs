using CloudCrafter.DockerCompose.Engine.Models;
using CloudCrafter.DockerCompose.Engine.Yaml;
using FluentAssertions;

namespace CloudCrafter.DockerCompose.Engine.UnitTests.Yaml;

[TestFixture]
public class DockerComposeHealthCheckTest
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

    private readonly string yamlWithHealthCheckString =
        @"
 services:
  webserver:
    image: nginx
    healthcheck:
      test: ""curl -f http://localhost""
";

    private readonly string yamlWithHealthCheckArray =
        @"
services:
  # This service will have a successful healthcheck
  web:
    image: nginx:alpine
    labels:
      cloudcrafter.managed: ""true""
      cloudcrafter.stack.id: ""71125cfe-caa4-42fe-9ccb-cf987ea38f3a""
      cloudcrafter.stack.service.id: ""3a7c1d45-9f3e-4b1a-8f2c-d4e5f6a7b8c9""
    healthcheck:
      test:
        [
          ""CMD"",
          ""wget"",
          ""--quiet"",
          ""--tries=1"",
          ""--spider"",
          ""http://localhost:80"",
        ]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 5s
";

    private DockerComposeEditor _editor;

    [Test]
    public void ShouldNotHaveAHealthCheck()
    {
        _editor.Service("db").HasHealthCheck().Should().BeFalse();
    }

    [Test]
    public async Task ShouldBeAbleToAddHealthCheckToExistingService()
    {
        var service = _editor.Service("db");

        service.AddHealthCheck(
            new ServiceHealthCheck()
            {
                Test = "curl -f http://localhost/ || exit 1",
                IntervalSeconds = 5,
                TimeoutSeconds = 3,
                Retries = 10,
                StartPeriodSeconds = 11,
            }
        );

        var isValid = await _editor.IsValid();
        isValid.Should().BeTrue();

        var yaml = _editor.GetYaml();

        await Verify(yaml);
    }

    [Test]
    public async Task ShouldHaveHealthCheckWithExistingService()
    {
        var editor = new DockerComposeEditor(yamlWithHealthCheckArray);

        var service = editor.Service("web");
        service.HasHealthCheck().Should().BeTrue();

        var isValid = await editor.IsValid();

        isValid.Should().BeTrue();

        var yaml = editor.GetYaml();
        await Verify(yaml);
    }

    [Test]
    public async Task ShouldHaveHealthCheckWithExistingServiceAsNormalString()
    {
        var editor = new DockerComposeEditor(yamlWithHealthCheckString);

        var service = editor.Service("webserver");
        service.HasHealthCheck().Should().BeTrue();

        var isValid = await editor.IsValid();

        isValid.Should().BeTrue();

        var yaml = editor.GetYaml();
        await Verify(yaml);
    }
}
