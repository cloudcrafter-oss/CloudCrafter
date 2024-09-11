// See https://aka.ms/new-console-template for more information

using YamlDotNet.RepresentationModel;

Console.WriteLine("Hello, World!");
string yamlString =
    @"
version: '3.8'
services:
  web:
    image: php:7.4-apache
    ports:
      - ""80:80""
    volumes:
      - ./php-app:/var/www/html
    networks:
      - lampnet
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: example
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - lampnet

volumes:
  db_data:

#dummy
networks:
  lampnet:
";

var yaml = new YamlStream();
using (var reader = new StringReader(yamlString))
{
    yaml.Load(reader);
}

// Get the root node
var rootNode = (YamlMappingNode)yaml.Documents[0].RootNode;

// Get the services node
var servicesNode = (YamlMappingNode)rootNode["services"];

// Add labels to web service
var webNode = (YamlMappingNode)servicesNode["web"];
var webLabels = new YamlMappingNode();
webLabels.Add("app", "web");
webLabels.Add("environment", "development");
webNode.Add("labels", webLabels);

// Add labels to db service
var dbNode = (YamlMappingNode)servicesNode["db"];
var dbLabels = new YamlMappingNode();
dbLabels.Add("app", "database");
dbLabels.Add("environment", "development");
dbNode.Add("labels", dbLabels);

// Serialize back to YAML
using (var writer = new StringWriter())
{
    yaml.Save(writer, false);
    var editedYaml = writer.ToString();
    Console.WriteLine(editedYaml);
}
