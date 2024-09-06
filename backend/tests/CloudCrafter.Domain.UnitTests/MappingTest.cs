using System.Runtime.CompilerServices;
using CloudCrafter.Domain.Domain.User;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Domain.UnitTests.Mappers;

namespace CloudCrafter.Domain.UnitTests;

public class MappingTest : BaseMapperTest
{
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
        {
            return Activator.CreateInstance(type)!;
        }

        // Type without parameterless constructor
        return RuntimeHelpers.GetUninitializedObject(type);
    }
}
