using System.Net.Http.Json;
using System.Text.Json.Nodes;
using FluentAssertions;
using Microsoft.OpenApi.Models;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.OpenApi;

using static Testing;

public class OpenApiDocumentTests : BaseTestFixture
{
    [Test]
    public async Task OpenApiDocumentIsReturned()
    {
        // Arrange
        var client = _factory.CreateClient();

        // Act
        for (var i = 0; i < 5; i++)
        {
            var response = await client.GetAsync("/openapi/v1.json"); // Add leading slash to make relative URI
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();

            var models = GetModelNames(content);
            models.Count.Should().BeGreaterThan(0);

            foreach (var modelName in models)
            {
                Assert.That(
                    modelName,
                    Does.Not.Match(@"\d+$"),
                    $"Model name '{modelName}' should not end with a number"
                );
            }
        }
    }

    private static List<string> GetModelNames(string openApiJson)
    {
        var document = JsonNode.Parse(openApiJson);

        if (document == null)
        {
            return [];
        }
        var schemas = document["components"]?["schemas"];

        if (schemas == null)
            return new List<string>();

        return schemas.AsObject().Select(schema => schema.Key).OrderBy(name => name).ToList();
    }
}
