using System.Reflection;
using System.Runtime.CompilerServices;
using AutoMapper;
using CloudCrafter.Domain.Domain.User;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Domain.UnitTests;

public class MappingTest
{
    private readonly MapperConfiguration _configuration;
    private readonly IMapper _mapper;

    public MappingTest()
    {
        _configuration = new MapperConfiguration(config => 
            config.AddMaps(Assembly.GetAssembly(typeof(IDomainTarget))));

        _mapper = _configuration.CreateMapper();
    }
    
    [Test]
    public void ShouldHaveValidConfiguration()
    {
        _configuration.AssertConfigurationIsValid();
    }
    
    [Test]
    [TestCase(typeof(User), typeof(UserDto))]
    public void ShouldSupportMappingFromSourceToDestination(Type source, Type destination)
    {
        var instance = GetInstanceOf(source);

        _mapper.Map(instance, source, destination);
    }
    
    private object GetInstanceOf(Type type)
    {
        if (type.GetConstructor(Type.EmptyTypes) != null)
            return Activator.CreateInstance(type)!;

        // Type without parameterless constructor
        return RuntimeHelpers.GetUninitializedObject(type);
    }
}
