using Polly;
using Polly.Retry;

namespace CloudCrafter.Shared.Utils.Http;

public class RetryHttpClient(HttpClient httpClient)
{
    public Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken = default)
    {
        return httpClient.SendAsync(request, cancellationToken);
    }

    public Task<HttpResponseMessage> GetAsync(string requestUri, CancellationToken cancellationToken = default)
    {
        return httpClient.GetAsync(requestUri, cancellationToken);
    }

    public Task<HttpResponseMessage> PostAsync(string requestUri, HttpContent content, CancellationToken cancellationToken = default)
    {
        return httpClient.PostAsync(requestUri, content, cancellationToken);
    }
}
