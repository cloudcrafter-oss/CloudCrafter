using CloudCrafter.DockerCompose.Engine.Exceptions;
using YamlDotNet.RepresentationModel;

namespace CloudCrafter.DockerCompose.Engine.Yaml;

public class DockerComposeEditor
{
    private YamlStream yaml;
    private YamlMappingNode rootNode;
    private YamlMappingNode servicesNode;

    public DockerComposeEditor(string yamlString)
    {
        yaml = new YamlStream();
        using (var reader = new StringReader(yamlString))
        {
            yaml.Load(reader);
        }

        rootNode = (YamlMappingNode)yaml.Documents[0].RootNode;
        servicesNode = (YamlMappingNode)rootNode["services"];
    }

    public ServiceEditor Service(string serviceName)
    {
        var serviceNode = GetServiceNode(serviceName);
        
        return new ServiceEditor(this, serviceName);
    }

    public ServiceEditor AddService(string serviceName)
    {
        if (servicesNode.Children.ContainsKey(serviceName))
        {
            throw new ServiceAlreadyExistsException(serviceName);
        }

        var serviceNode = new YamlMappingNode();
        servicesNode.Add(serviceName, serviceNode);
        return new ServiceEditor(this, serviceName);
    }
    


    public string GetYaml()
    {
        using (var writer = new StringWriter())
        {
            yaml.Save(writer, false);
            var yamlString = writer.ToString();
            
            // Remove the trailing "..."
            if (yamlString.EndsWith("...\n"))
            {
                yamlString = yamlString.Substring(0, yamlString.Length - 4);
            }

            return yamlString;
        }
    }

    private YamlMappingNode GetServiceNode(string serviceName)
    {
        try
        {
            return (YamlMappingNode)servicesNode[serviceName];
        }
        catch (KeyNotFoundException)
        {
            throw new InvalidServiceException(serviceName);
        }
    }

    public class ServiceEditor
    {
        private DockerComposeEditor editor;
        private string serviceName;

        public ServiceEditor(DockerComposeEditor editor, string serviceName)
        {
            this.editor = editor;
            this.serviceName = serviceName;
        }

        public ServiceEditor AddLabel(string key, string value)
        {
            var serviceNode = editor.GetServiceNode(serviceName);
            if (!serviceNode!.Children.ContainsKey("labels"))
            {
                serviceNode.Add("labels", new YamlMappingNode());
            }

            var labelsNode = (YamlMappingNode)serviceNode["labels"];
            labelsNode.Add(key, new YamlScalarNode(value));
            return this;
        }

        public ServiceEditor AddEnvironmentVariable(string key, string value)
        {
            var serviceNode = editor.GetServiceNode(serviceName);
            if (!serviceNode!.Children.ContainsKey("environment"))
            {
                serviceNode.Add("environment", new YamlMappingNode());
            }

            var envNode = (YamlMappingNode)serviceNode["environment"];
            envNode.Add(key, new YamlScalarNode(value));
            return this;
        }

        public ServiceEditor AddVolume(string hostPath, string containerPath)
        {
            var serviceNode = editor.GetServiceNode(serviceName);
            if (!serviceNode!.Children.ContainsKey("volumes"))
            {
                serviceNode.Add("volumes", new YamlSequenceNode());
            }

            var volumesNode = (YamlSequenceNode)serviceNode["volumes"];
            volumesNode.Add(new YamlScalarNode($"{hostPath}:{containerPath}"));
            return this;
        }

        public DockerComposeEditor Done()
        {
            return editor;
        }
    }
}
