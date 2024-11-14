namespace CloudCrafter.Core.Interfaces.Domain.Providers;

public interface IProvidersService
{
    Task<bool> CreateGithubProvider(string code);
}
