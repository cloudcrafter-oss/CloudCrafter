using Microsoft.Extensions.DependencyInjection;
using Polly;
using Polly.Extensions.Http;
using Polly.Retry;

namespace CloudCrafter.Shared.Utils.Http;

public abstract class RetryHttpClientFactory
{
    public static RetryHttpClient Create(int maxRetryAttempts = 3)
    {
        var serviceCollection = new ServiceCollection();
        AsyncRetryPolicy<HttpResponseMessage> retryPolicy = HttpPolicyExtensions
            .HandleTransientHttpError()
            .OrResult(msg => (int)msg.StatusCode == 429) // Too Many Requests
            .WaitAndRetryAsync(
                maxRetryAttempts,
                retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt))
            );

        // Register the HttpClient with the retry policy
        serviceCollection
            .AddHttpClient<RetryHttpClient>(client => { })
            .AddPolicyHandler(retryPolicy);

        var serviceProvider = serviceCollection.BuildServiceProvider();
        var retryHttpClient = serviceProvider.GetService<RetryHttpClient>();
        if (retryHttpClient == null)
        {
            throw new Exception("Failed to create RetryHttpClient");
        }

        return retryHttpClient;
    }
}
