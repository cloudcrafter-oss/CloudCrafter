using Bogus;
using CloudCrafter.Core.Jobs;
using CloudCrafter.Core.Jobs.Serializer;
using CloudCrafter.Domain.Entities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;

namespace CloudCrafter.UnitTests.Core.Jobs;

public class JobSerializerTest
{
    private Mock<ILogger<JobSerializer>> _logger;
    private JobSerializer _serializer;

    [SetUp]
    public void Setup()
    {
        _logger = new Mock<ILogger<JobSerializer>>();
        _serializer = new JobSerializer(_logger.Object);
    }

    [Test]
    public async Task Serialize_WhenCalled_ReturnsSerializedJob()
    {
        Faker faker = new();

        bool? nullableBool = null;
        if (faker.Random.Bool())
        {
            nullableBool = faker.Random.Bool();
        }

        int? nullableNumber = null;
        if (faker.Random.Bool())
        {
            nullableNumber = faker.Random.Number();
        }

        string? nullableString = null;
        if (faker.Random.Bool())
        {
            nullableString = faker.Internet.DomainName();
        }

        // Arrange
        var job = new DummyTestJob(faker.Internet.DomainName(), faker.Random.Number(), faker.Random.Bool(),
            nullableBool,
            nullableNumber, nullableString);

        // Act
        var result = await _serializer.Serialize<DummyTestJob>(job);

        // Assert
        result.Should().NotBeNull();
        result.JobType.Should().Be(typeof(DummyTestJob).ToString());

        var expectedJson =
            $"{{\"NullableString\":{(nullableString == null ? "null" : $"\"{nullableString}\"")},\"NullableNumber\":{(nullableNumber == null ? "null" : nullableNumber.ToString())},\"NullableBool\":{(nullableBool == null ? "null" : nullableBool.Value.ToString().ToLower())},\"IsTrue\":{job.IsTrue.ToString().ToLower()},\"Number\":{job.Number},\"Name\":\"{job.Name}\",\"Type\":1}}";
        result.SerializedJob.Should().Be(expectedJson);
    }

    [Test]
    public async Task ShouldBeAbleToDeserializeJob()
    {
        Faker faker = new();

        bool? nullableBool = null;
        if (faker.Random.Bool())
        {
            nullableBool = faker.Random.Bool();
        }

        int? nullableNumber = null;
        if (faker.Random.Bool())
        {
            nullableNumber = faker.Random.Number();
        }

        string? nullableString = null;
        if (faker.Random.Bool())
        {
            nullableString = faker.Internet.DomainName();
        }

        var randomBool = faker.Random.Bool();
        var randomNumber = faker.Random.Number();
        var randomString = faker.Internet.DomainName();
        var json =
            $"{{\"NullableString\":{(nullableString == null ? "null" : $"\"{nullableString}\"")},\"NullableNumber\":{(nullableNumber == null ? "null" : nullableNumber.ToString())},\"NullableBool\":{(nullableBool == null ? "null" : nullableBool.Value.ToString().ToLower())},\"IsTrue\":{randomBool.ToString().ToLower()},\"Number\":{randomNumber},\"Name\":\"{randomString}\"}}";

        // Act
        var result = await _serializer.Deserialize(json, typeof(DummyTestJob));

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<DummyTestJob>();

        var dummyTestJob = result as DummyTestJob;
        dummyTestJob.Should().NotBeNull();
        dummyTestJob!.NullableString.Should().Be(nullableString);
        dummyTestJob.NullableNumber.Should().Be(nullableNumber);
        dummyTestJob.NullableBool.Should().Be(nullableBool);
        dummyTestJob.IsTrue.Should().Be(randomBool);
        dummyTestJob.Number.Should().Be(randomNumber);
        dummyTestJob.Name.Should().Be(randomString);
        dummyTestJob.Type.Should().Be(BackgroundJobType.StackDeployment);
    }
}

public class DummyTestJob : IJob
{
    // required for deserialization
    public DummyTestJob()
    {
    }

    public DummyTestJob(string name, int number, bool isTrue, bool? nullableBool, int? nullableNumber,
        string? nullableString)
    {
        Name = name;
        Number = number;
        IsTrue = isTrue;
        NullableBool = nullableBool;
        NullableNumber = nullableNumber;
        NullableString = nullableString;
    }

    public string? NullableString { get; set; }

    public int? NullableNumber { get; set; }

    public bool? NullableBool { get; set; }

    public bool IsTrue { get; set; }

    public int Number { get; set; }

    public string Name { get; set; } = null!;

    public BackgroundJobType Type => BackgroundJobType.StackDeployment;

    public Task Handle(IServiceProvider serviceProvider, ILoggerFactory loggerFactory, string jobId)
    {
        throw new NotImplementedException();
    }
}
