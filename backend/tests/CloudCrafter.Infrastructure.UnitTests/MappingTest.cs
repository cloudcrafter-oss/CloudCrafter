using System.Reflection;
using AutoMapper;
using CloudCrafter.Infrastructure.Data;

namespace CloudCrafter.Infrastructure.UnitTests;

public class MappingTest
{
    private readonly MapperConfiguration _configuration;
    private readonly IMapper _mapper;

    public MappingTest()
    {
        _configuration = new MapperConfiguration(config =>
            config.AddMaps(Assembly.GetAssembly(typeof(AppDbContext)))
        );

        _mapper = _configuration.CreateMapper();
    }

    [Test]
    public void ShouldHaveValidConfiguration()
    {
        _configuration.AssertConfigurationIsValid();
    }
}
