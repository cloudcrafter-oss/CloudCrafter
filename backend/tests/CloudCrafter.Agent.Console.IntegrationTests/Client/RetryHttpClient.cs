using Polly;
using Polly.Retry;

namespace CloudCrafter.Agent.Console.IntegrationTests.Client;

public class RetryHttpClient : IDisposable
{
    private readonly HttpClient _httpClient;
    private readonly AsyncRetryPolicy<HttpResponseMessage> _retryPolicy;

    public RetryHttpClient(int maxRetryAttempts = 3, int retryDelayMilliseconds = 1000)
    {
        _httpClient = new HttpClient();

        _retryPolicy = Policy
            .HandleResult<HttpResponseMessage>(r => !r.IsSuccessStatusCode)
            .WaitAndRetryAsync(
                maxRetryAttempts,
                retryAttempt => TimeSpan.FromMilliseconds(retryDelayMilliseconds * Math.Pow(2, retryAttempt - 1)),
                onRetry: (outcome, timespan, retryAttempt, context) =>
                {
                    System.Console.WriteLine(
                        $"Request failed. Waiting {timespan} before retry. Attempt {retryAttempt}");
                });
    }

    public void Dispose()
    {
        _httpClient.Dispose();
    }

    public async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request)
    {
        return await _retryPolicy.ExecuteAsync(async () => await _httpClient.SendAsync(request));
    }
}
