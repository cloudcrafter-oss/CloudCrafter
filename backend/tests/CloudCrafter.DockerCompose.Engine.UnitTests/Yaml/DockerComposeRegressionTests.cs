using CloudCrafter.DockerCompose.Engine.Yaml;
using FluentAssertions;

namespace CloudCrafter.DockerCompose.Engine.UnitTests.Yaml;

public class DockerComposeRegressionTests
{
    private readonly string _yamlBrokenOneValid =
        @"
services:
  my-custom-service-123:
    healthcheck:
      test: curl -f http://127.0.0.1:3000/
      interval: 3s
      timeout: 4s
      retries: 3
      start_period: 3s
    labels:
      cloudcrafter.managed: true
      cloudcrafter.stack.id: 35223e08-9c9f-4322-972e-51c610c202e3
      cloudcrafter.stack.service.id: b34a6560-701d-4f0e-b024-b4b7b2155bcf
      cloudcrafter.deployment: fde85aa6-8dd6-48c9-8c4b-8172a2f15f28
      traefik.enable: true
      traefik.http.routers.b34a6560-701d-4f0e-b024-b4b7b2155bcf.rule: Host(`my-custom-domain.com`)
      traefik.http.routers.b34a6560-701d-4f0e-b024-b4b7b2155bcf.entrypoints: web
      traefik.http.routers.b34a6560-701d-4f0e-b024-b4b7b2155bcf.service: b34a6560-701d-4f0e-b024-b4b7b2155bcf
      traefik.http.services.b34a6560-701d-4f0e-b024-b4b7b2155bcf.loadbalancer.server.port: -1
    networks:
    - cloudcrafter
    image: b34a6560-701d-4f0e-b024-b4b7b2155bcf:latest
networks:
  cloudcrafter:
    name: cloudcrafter
    external: true
";
    private readonly string _yamlBrokenOneInvalid =
        @"
services:
  my-custom-service-123:
    healthcheck:
      test: curl -f http://127.0.0.1:3000/
      interval: 3s
      timeout: 4s
      retries: 3
      start_period: 3s
    labels:
      cloudcrafter.managed: true
      cloudcrafter.stack.id: 35223e08-9c9f-4322-972e-51c610c202e3
      cloudcrafter.stack.service.id: b34a6560-701d-4f0e-b024-b4b7b2155bcf
      cloudcrafter.deployment: fde85aa6-8dd6-48c9-8c4b-8172a2f15f28
      traefik.enable: true
      traefik.http.routers.b34a6560-701d-4f0e-b024-b4b7b2155bcf.rule: Host(`my-custom-domain.com`)
      traefik.http.routers.b34a6560-701d-4f0e-b024-b4b7b2155bcf.entrypoints: web
      traefik.http.routers.b34a6560-701d-4f0e-b024-b4b7b2155bcf.service: b34a6560-701d-4f0e-b024-b4b7b2155bcf
      traefik.http.services.b34a6560-701d-4f0e-b024-b4b7b2155bcf.loadbalancer.server.port: -1
    networks:
    - cloudcrafter
    image: b34a6560-701d-4f0e-b024-b4b7b2155bcf:latest
networks:
  cloudcrafter:
    name: cloudcrafter
    external: trues
";

    [Test]
    public async Task ShouldBeInvalidYaml()
    {
        var editor = new DockerComposeEditor(_yamlBrokenOneInvalid);

        var isValid = await editor.IsValid();

        isValid.Should().BeFalse();
    }

    [Test]
    public async Task ShouldBeValidYaml()
    {
        var editor = new DockerComposeEditor(_yamlBrokenOneValid);

        var isValid = await editor.IsValid();

        isValid.Should().BeTrue();
    }
}
