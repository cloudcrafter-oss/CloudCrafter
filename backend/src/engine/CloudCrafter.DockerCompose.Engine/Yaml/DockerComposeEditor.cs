using System.Text;
using System.Text.RegularExpressions;
using CloudCrafter.DockerCompose.Engine.Exceptions;
using CloudCrafter.DockerCompose.Engine.Validator;
using Slugify;
using YamlDotNet.RepresentationModel;

namespace CloudCrafter.DockerCompose.Engine.Yaml;

public class DockerComposeEditor
{
    private static readonly Regex ServiceNameRegex =
        new(@"^[a-z0-9][a-z0-9_-]*$", RegexOptions.Compiled);

    private readonly YamlMappingNode rootNode;
    private readonly YamlMappingNode servicesNode;

    private readonly SlugHelper SlugHelper = new();
    private readonly YamlStream yaml;
    private YamlMappingNode? networksNode;

    public DockerComposeEditor(string yamlString)
    {
        yaml = new YamlStream();
        using (var reader = new StringReader(yamlString))
        {
            yaml.Load(reader);
        }

        rootNode = (YamlMappingNode)yaml.Documents[0].RootNode;
        servicesNode = (YamlMappingNode)rootNode["services"];

        if (rootNode.Children.ContainsKey("networks"))
        {
            networksNode = (YamlMappingNode)rootNode["networks"];
        }
    }

    public DockerComposeEditor()
    {
        yaml = new YamlStream { new YamlDocument(new YamlMappingNode()) };

        rootNode = (YamlMappingNode)yaml.Documents[0].RootNode;
        servicesNode = new YamlMappingNode();
        rootNode.Add("services", servicesNode);
    }

    private bool IsValidServiceName(string serviceName)
    {
        return !string.IsNullOrWhiteSpace(serviceName) && ServiceNameRegex.IsMatch(serviceName);
    }

    private string SanitizeServiceName(string serviceName)
    {
        // Slugify the service name
        var slugified = SlugHelper.GenerateSlug(serviceName).ToLower();

        // Ensure it starts with a letter or number (prepend 's' if it doesn't)
        if (!char.IsLetterOrDigit(slugified[0]))
        {
            slugified = "s" + slugified;
        }

        return slugified;
    }

    public ServiceEditor Service(string serviceName)
    {
        var serviceNode = GetServiceNode(serviceName);

        return new ServiceEditor(this, serviceName);
    }

    public List<string> Services()
    {
        return servicesNode.Children.Keys.Select(key => key.ToString()).ToList();
    }

    public ServiceEditor AddService(string serviceName)
    {
        var sanitizedName = SanitizeServiceName(serviceName);
        if (!IsValidServiceName(sanitizedName))
        {
            throw new ArgumentException(
                $"Unable to create a valid service name from '{serviceName}'. Please provide a name that can be converted to a valid Docker Compose service name."
            );
        }

        if (servicesNode.Children.ContainsKey(sanitizedName))
        {
            throw new ServiceAlreadyExistsException(sanitizedName);
        }

        var serviceNode = new YamlMappingNode();
        servicesNode.Add(sanitizedName, serviceNode);
        return new ServiceEditor(this, sanitizedName);
    }

    public NetworkEditor AddNetwork(string networkName)
    {
        if (networksNode == null)
        {
            networksNode = new YamlMappingNode();
            rootNode.Add("networks", networksNode);
        }

        if (networksNode.Children.ContainsKey(networkName))
        {
            throw new NetworkAlreadyExistsException(networkName);
        }

        var networkNode = new YamlMappingNode();
        networksNode.Add(networkName, networkNode);

        return new NetworkEditor(this, networkName);
    }

    public NetworkEditor Network(string networkName)
    {
        var networkNode = GetNetworkNode(networkName);

        return new NetworkEditor(this, networkName);
    }

    public string ToBase64()
    {
        var yaml = GetYaml();
        var bytes = Encoding.UTF8.GetBytes(yaml);
        return Convert.ToBase64String(bytes);
    }

    public string GetYaml()
    {
        if (servicesNode.Children.Count == 0)
        {
            throw new DockerComposeInvalidStateException("No services defined");
        }

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

    public Task<bool> IsValid()
    {
        var validator = new DockerComposeValidator(GetYaml());

        return validator.IsValid();
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

    private YamlMappingNode GetNetworkNode(string networkName)
    {
        try
        {
            if (networksNode == null)
            {
                throw new DockerComposeInvalidStateException("Networks are not created or defined");
            }

            return (YamlMappingNode)networksNode[networkName];
        }
        catch (KeyNotFoundException)
        {
            throw new InvalidNetworkException(networkName);
        }
    }

    public class NetworkEditor(DockerComposeEditor Editor, string NetworkName)
    {
        public NetworkEditor SetKeyValue(string key, string value)
        {
            var networkNode = Editor.GetNetworkNode(NetworkName);

            networkNode.Add(key, value);

            return this;
        }

        public NetworkEditor SetNetworkName(string networkName)
        {
            return SetKeyValue("name", networkName);
        }

        public NetworkEditor SetIsExternalNetwork()
        {
            return SetKeyValue("external", "true");
        }

        public string GetNetworkName()
        {
            return NetworkName;
        }
    }

    public class ServiceEditor
    {
        private readonly DockerComposeEditor editor;
        private readonly string serviceName;

        public ServiceEditor(DockerComposeEditor editor, string serviceName)
        {
            this.editor = editor;
            this.serviceName = serviceName;
        }

        public string ServiceName()
        {
            return serviceName;
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

        public ServiceEditor AddLabels(DockerComposeLabelService labelService)
        {
            var labels = labelService.ToDictionary();

            foreach (var label in labels)
            {
                AddLabel(label.Key, label.Value);
            }

            return this;
        }

        public ServiceEditor SetImage(string image, string tag)
        {
            var serviceNode = editor.GetServiceNode(serviceName);

            var imageTag = $"{image}:{tag}";
            if (serviceNode.Children.ContainsKey("image"))
            {
                var imageNode = (YamlScalarNode)serviceNode["image"];
                imageNode.Value = imageTag;
                return this;
            }

            serviceNode!.Add("image", imageTag);
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

        public ServiceEditor AddNetwork(NetworkEditor network)
        {
            var serviceNode = editor.GetServiceNode(serviceName);

            YamlSequenceNode networks;
            if (!serviceNode!.Children.ContainsKey("networks"))
            {
                networks = new YamlSequenceNode();
                serviceNode.Add("networks", networks);
            }
            else
            {
                networks = (YamlSequenceNode)serviceNode["networks"];
            }

            networks.Add(new YamlScalarNode(network.GetNetworkName()));

            return this;
        }

        public ServiceEditor AddExposedPort(int hostPort, int containerPort)
        {
            var serviceNode = editor.GetServiceNode(serviceName);

            YamlSequenceNode ports;
            if (!serviceNode!.Children.ContainsKey("ports"))
            {
                ports = new YamlSequenceNode();
                serviceNode.Add("ports", ports);
            }
            else
            {
                ports = (YamlSequenceNode)serviceNode["ports"];
            }

            ports.Add(new YamlScalarNode($"{hostPort}:{containerPort}"));

            return this;
        }
    }
}
