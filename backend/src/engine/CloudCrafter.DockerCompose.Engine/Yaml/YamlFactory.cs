using YamlDotNet.Core.Events;
using YamlDotNet.RepresentationModel;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace CloudCrafter.DockerCompose.Engine.Yaml;

public static class YamlFactory
{
    public static string YamlToJson(string yaml)
    {
        var deserializer = new DeserializerBuilder()
            .WithNodeTypeResolver(new InferTypeFromValue())
            .Build();
        var yamlObject = deserializer.Deserialize(yaml);

        var serializer = new SerializerBuilder()
            .JsonCompatible()
            .Build();

        var json = serializer.Serialize(yamlObject);

        return json;
    }

  
    
    private class InferTypeFromValue : INodeTypeResolver
    {

        public bool Resolve(NodeEvent? nodeEvent, ref Type currentType)
        {
            if(nodeEvent == null)
            {
                return false;
            }

            if (nodeEvent is Scalar scalar)
            {
                // TODO: This heuristics could be improved
                int value;
                if (int.TryParse(scalar.Value, out value))
                {
                    currentType = typeof(int);
                    return true;
                }
            }
            return false;
        }
    }
}
