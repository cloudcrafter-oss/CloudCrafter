FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
RUN apt-get update && apt-get install -y git && apt-get clean && rm -rf /var/lib/apt/lists/*
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/CloudCrafter.Web/CloudCrafter.Web.csproj", "src/CloudCrafter.Web/"]
COPY ["src/CloudCrafter.Infrastructure/CloudCrafter.Infrastructure.csproj", "src/CloudCrafter.Infrastructure/"]
COPY ["src/CloudCrafter.Core/CloudCrafter.Core.csproj", "src/CloudCrafter.Core/"]
COPY ["src/CloudCrafter.Domain/CloudCrafter.Domain.csproj", "src/CloudCrafter.Domain/"]
COPY ["src/CloudCrafter.Utils/CloudCrafter.Utils.csproj", "src/CloudCrafter.Utils/"]
COPY ["src/Packages/EntityFrameworkCore.EncryptColumn/EntityFrameworkCore.EncryptColumn.csproj", "src/Packages/EntityFrameworkCore.EncryptColumn/"]
COPY ["src/CloudCrafter.Jobs.Service/CloudCrafter.Jobs.Service.csproj", "src/CloudCrafter.Jobs.Service/"]
COPY ["src/engine/CloudCrafter.DeploymentEngine.Domain/CloudCrafter.DeploymentEngine.Domain.csproj", "src/engine/CloudCrafter.DeploymentEngine.Domain/"]
COPY ["src/engine/CloudCrafter.DeploymentEngine.Remote/CloudCrafter.DeploymentEngine.Remote.csproj", "src/engine/CloudCrafter.DeploymentEngine.Remote/"]
COPY . .
RUN dotnet restore "src/CloudCrafter.Web/CloudCrafter.Web.csproj"
WORKDIR "/src/src/CloudCrafter.Web"
RUN dotnet build "CloudCrafter.Web.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "CloudCrafter.Web.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .



ENTRYPOINT ["dotnet", "CloudCrafter.Web.dll"]
