namespace CloudCrafter.UseCases.Domain.Auth.Services;

public interface ICloudCrafterAuthService
{
    Task LoginAsync(string username, string password);
}
