using System.Reflection;
using System.Text.Json;
using CloudCrafter.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Serializer;

public class JobSerializer(ILogger<JobSerializer> logger)
{
    public Task<SerializedJobResult> Serialize<TJob>(IJob job)
    {
        var jobProperties = job.GetType()
            .GetProperties(BindingFlags.Public | BindingFlags.Instance)
            .ToDictionary(prop => prop.Name, prop => prop.GetValue(job));

        var serializedJob = JsonSerializer.Serialize(jobProperties);

        logger.LogDebug("Dispatching job: {serializedJob}", serializedJob);

        var result = new SerializedJobResult(typeof(TJob).ToString(), serializedJob);

        return Task.FromResult(result);
    }

    public Task<IJob> Deserialize(string serializedJob, Type jobType)
    {
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

        var job = (IJob?)JsonSerializer.Deserialize(serializedJob, jobType, options);

        if (job is null)
        {
            throw new InvalidOperationException(
                $"Failed to deserialize job of type {jobType.FullName}"
            );
        }

        return Task.FromResult(job);
    }

    private object? ConvertJsonElement(JsonElement element, Type targetType)
    {
        if (targetType == typeof(string))
        {
            return element.ValueKind == JsonValueKind.Null ? null : element.GetString();
        }

        if (targetType == typeof(int) || targetType == typeof(int?))
        {
            return element.ValueKind == JsonValueKind.Null ? null : element.GetInt32();
        }

        if (targetType == typeof(long) || targetType == typeof(long?))
        {
            return element.ValueKind == JsonValueKind.Null ? null : element.GetInt64();
        }

        if (targetType == typeof(double) || targetType == typeof(double?))
        {
            return element.ValueKind == JsonValueKind.Null ? null : element.GetDouble();
        }

        if (targetType == typeof(bool) || targetType == typeof(bool?))
        {
            return element.ValueKind == JsonValueKind.Null ? null : element.GetBoolean();
        }

        if (targetType == typeof(DateTime) || targetType == typeof(DateTime?))
        {
            return element.ValueKind == JsonValueKind.Null ? null : element.GetDateTime();
        }

        if (targetType == typeof(Guid) || targetType == typeof(Guid?))
        {
            return element.ValueKind == JsonValueKind.Null ? null : element.GetGuid();
        }

        if (targetType == typeof(BackgroundJobType))
        {
            return element.ValueKind == JsonValueKind.Null
                ? null
                : Enum.Parse<BackgroundJobType>(element.GetString()!);
        }

        return element.ValueKind switch
        {
            JsonValueKind.String => element.GetString(),
            JsonValueKind.Number => Convert.ChangeType(element.GetDouble(), targetType),
            JsonValueKind.True => true,
            JsonValueKind.False => false,
            JsonValueKind.Null => null,
            _ => throw new ArgumentException($"Unsupported JSON value kind: {element.ValueKind}"),
        };
    }
}

public record SerializedJobResult(string JobType, string SerializedJob);
