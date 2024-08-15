FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/CloudCrafter.Agent.Console/CloudCrafter.Agent.Console.csproj", "src/CloudCrafter.Agent.Console/"]
COPY ["src/CloudCrafter.Agent.Runner/CloudCrafter.Agent.Runner.csproj", "src/CloudCrafter.Agent.Runner/"]
COPY ["src/CloudCrafter.Agent.Models/CloudCrafter.Agent.Models.csproj", "src/CloudCrafter.Agent.Models/"]
COPY ["src/CloudCrafter.DockerCompose.Shared/CloudCrafter.DockerCompose.Shared.csproj", "src/CloudCrafter.DockerCompose.Shared/"]
COPY ["src/CloudCrafter.Shared.Deployment/CloudCrafter.Shared.Deployment.csproj", "src/CloudCrafter.Shared.Deployment/"]
COPY ["src/CloudCrafter.Shared.Utils/CloudCrafter.Shared.Utils.csproj", "src/CloudCrafter.Shared.Utils/"]
COPY ["src/engine/CloudCrafter.DockerCompose.Engine/CloudCrafter.DockerCompose.Engine.csproj", "src/engine/CloudCrafter.DockerCompose.Engine/"]
COPY . .
RUN dotnet restore "src/CloudCrafter.Agent.Console/CloudCrafter.Agent.Console.csproj"

WORKDIR "/src/src/CloudCrafter.Agent.Console"
RUN dotnet build "CloudCrafter.Agent.Console.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "CloudCrafter.Agent.Console.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CloudCrafter.Agent.Console.dll"]
