using System.Text.Json.Serialization;

namespace CloudCrafter.Domain.Domain.Deployment;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum DeploymentStatusDto
{
    Created,
    Running,
    Failed,
    Succeeded,
}
