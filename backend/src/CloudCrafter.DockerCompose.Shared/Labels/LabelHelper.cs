namespace CloudCrafter.DockerCompose.Shared.Labels;

public abstract class LabelHelper
{
    public static string GenerateApplicationLabel(Guid applicationId)
    {
        return $"cloudcrafter.application={applicationId}";
    }
}
