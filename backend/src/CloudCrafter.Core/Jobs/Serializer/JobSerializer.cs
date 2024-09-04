using System.Reflection;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Serializer;

public class JobSerializer(ILogger<JobSerializer> logger)
{
    public Task<SerializedJobResult> Serialize<TJob>(IJob job)
    {
        var jobProperties = job.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance)
            .ToDictionary(prop => prop.Name, prop => prop.GetValue(job));

        var serializedJob = JsonSerializer.Serialize(jobProperties);

        logger.LogDebug("Dispatching job: {serializedJob}", serializedJob);

        var result = new SerializedJobResult(typeof(TJob), serializedJob);

        return Task.FromResult(result);
    }

    public Task<IJob> Deserialize(string serializedJob, Type jobType)
    {
        var jobProperties = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(serializedJob);
        var job = (IJob?)Activator.CreateInstance(jobType);

        if (jobProperties is null)
        {
            throw new InvalidOperationException("Failed to deserialize job properties");
        }

        if (job is null)
        {
            throw new InvalidOperationException("Failed to create job instance");
        }

        foreach (var prop in jobType.GetProperties(BindingFlags.Public | BindingFlags.Instance))
        {
            if (jobProperties.TryGetValue(prop.Name, out var value))
            {
                var convertedValue = ConvertJsonElement(value, prop.PropertyType);
                prop.SetValue(job, convertedValue);
            }
        }

        return Task.FromResult(job);
    }

    private object? ConvertJsonElement(JsonElement element, Type targetType)
    {
        if (targetType == typeof(string))
            return element.ValueKind == JsonValueKind.Null ? null : element.GetString();
        
        if (targetType == typeof(int) || targetType == typeof(int?))
            return element.ValueKind == JsonValueKind.Null ? null : element.GetInt32();
        
        if (targetType == typeof(long) || targetType == typeof(long?))
            return element.ValueKind == JsonValueKind.Null ? null : element.GetInt64();
        
        if (targetType == typeof(double) || targetType == typeof(double?))
            return element.ValueKind == JsonValueKind.Null ? null : element.GetDouble();
        
        if (targetType == typeof(bool) || targetType == typeof(bool?))
            return element.ValueKind == JsonValueKind.Null ? null : element.GetBoolean();
        
        if (targetType == typeof(DateTime) || targetType == typeof(DateTime?))
            return element.ValueKind == JsonValueKind.Null ? null : element.GetDateTime();
        
        if (targetType == typeof(Guid) || targetType == typeof(Guid?))
            return element.ValueKind == JsonValueKind.Null ? null : element.GetGuid();

        throw new ArgumentException($"Unsupported target type: {targetType.Name}");
    }
}

public record SerializedJobResult(Type JobType, string SerializedJob);
