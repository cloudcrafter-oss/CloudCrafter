using System.Net;
using System.Text;
using System.Text.Json;
using Ardalis.GuardClauses;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Web.Infrastructure;
using FluentAssertions;
using FluentValidation.Results;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Exceptions;

[TestFixture]
public class CustomExceptionHandlerTest
{
    private CustomExceptionHandler _handler;
    private DefaultHttpContext _httpContext;
    private MemoryStream _responseBodyStream;

    [SetUp]
    public void Setup()
    {
        _handler = new CustomExceptionHandler();

        // Create a service collection and add required services
        var serviceCollection = new ServiceCollection();
        serviceCollection.AddLogging();
        serviceCollection.AddControllers();
        var serviceProvider = serviceCollection.BuildServiceProvider();

        // Create a real DefaultHttpContext with the service provider
        _httpContext = new DefaultHttpContext { RequestServices = serviceProvider };

        _responseBodyStream = new MemoryStream();
        _httpContext.Response.Body = _responseBodyStream;
    }

    [TearDown]
    public void TearDown()
    {
        _responseBodyStream.Dispose();
    }

    [Test]
    public async Task TryHandleAsync_WithValidationException_ReturnsTrue()
    {
        // Arrange
        var validationFailures = new List<ValidationFailure>
        {
            new ValidationFailure("PropertyName", "Error message"),
        };
        var exception = new ValidationException(validationFailures);

        // Act
        var result = await _handler.TryHandleAsync(_httpContext, exception, CancellationToken.None);

        // Assert
        result.Should().BeTrue();
        _httpContext.Response.StatusCode.Should().Be(StatusCodes.Status422UnprocessableEntity);
    }

    [Test]
    public async Task TryHandleAsync_WithNotFoundException_ReturnsTrue()
    {
        // Arrange
        var exception = new NotFoundException("entity", "Entity not found");

        // Act
        var result = await _handler.TryHandleAsync(_httpContext, exception, CancellationToken.None);

        // Assert
        result.Should().BeTrue();
        _httpContext.Response.StatusCode.Should().Be(StatusCodes.Status404NotFound);
    }

    [Test]
    public async Task TryHandleAsync_WithUnauthorizedAccessException_ReturnsTrue()
    {
        // Arrange
        var exception = new UnauthorizedAccessException("Unauthorized access");

        // Act
        var result = await _handler.TryHandleAsync(_httpContext, exception, CancellationToken.None);

        // Assert
        result.Should().BeTrue();
        _httpContext.Response.StatusCode.Should().Be(StatusCodes.Status401Unauthorized);
    }

    [Test]
    public async Task TryHandleAsync_WithUnhandledException_ReturnsFalse()
    {
        // Arrange
        var exception = new ArgumentException("Invalid argument");

        // Act
        var result = await _handler.TryHandleAsync(_httpContext, exception, CancellationToken.None);

        // Assert
        result.Should().BeFalse();
    }

    [Test]
    public async Task HandleValidationException_SetsCorrectStatusCode()
    {
        // Arrange
        var validationFailures = new List<ValidationFailure>
        {
            new ValidationFailure("PropertyName", "Error message"),
        };
        var exception = new ValidationException(validationFailures);

        // Act
        await _handler.TryHandleAsync(_httpContext, exception, CancellationToken.None);

        // Assert
        _httpContext.Response.StatusCode.Should().Be(StatusCodes.Status422UnprocessableEntity);

        // Reset the stream position to read the response
        _responseBodyStream.Position = 0;
        using var reader = new StreamReader(_responseBodyStream, Encoding.UTF8, leaveOpen: true);
        var responseContent = await reader.ReadToEndAsync();
        responseContent.Should().NotBeNullOrEmpty();
    }

    [Test]
    public async Task HandleNotFoundException_SetsCorrectStatusCode()
    {
        // Arrange
        var exception = new NotFoundException("entity", "Entity not found");

        // Act
        await _handler.TryHandleAsync(_httpContext, exception, CancellationToken.None);

        // Assert
        _httpContext.Response.StatusCode.Should().Be(StatusCodes.Status404NotFound);

        // Reset the stream position to read the response
        _responseBodyStream.Position = 0;
        using var reader = new StreamReader(_responseBodyStream, Encoding.UTF8, leaveOpen: true);
        var responseContent = await reader.ReadToEndAsync();
        responseContent.Should().NotBeNullOrEmpty();
    }

    [Test]
    public async Task HandleUnauthorizedAccessException_SetsCorrectStatusCode()
    {
        // Arrange
        var exception = new UnauthorizedAccessException("Unauthorized access");

        // Act
        await _handler.TryHandleAsync(_httpContext, exception, CancellationToken.None);

        // Assert
        _httpContext.Response.StatusCode.Should().Be(StatusCodes.Status401Unauthorized);

        // Reset the stream position to read the response
        _responseBodyStream.Position = 0;
        using var reader = new StreamReader(_responseBodyStream, Encoding.UTF8, leaveOpen: true);
        var responseContent = await reader.ReadToEndAsync();
        responseContent.Should().NotBeNullOrEmpty();
    }
}
