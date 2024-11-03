FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/CloudCrafter.Worker.Console/CloudCrafter.Worker.Console.csproj", "src/CloudCrafter.Worker.Console/"]
COPY ["src/CloudCrafter.Core/CloudCrafter.Core.csproj", "src/CloudCrafter.Core/"]
COPY ["src/Packages/EntityFrameworkCore.EncryptColumn/EntityFrameworkCore.EncryptColumn.csproj", "src/Packages/EntityFrameworkCore.EncryptColumn/"]
COPY ["src/CloudCrafter.Utils/CloudCrafter.Utils.csproj", "src/CloudCrafter.Utils/"]
COPY ["src/CloudCrafter.Domain/CloudCrafter.Domain.csproj", "src/CloudCrafter.Domain/"]
COPY ["src/CloudCrafter.Jobs.Service/CloudCrafter.Jobs.Service.csproj", "src/CloudCrafter.Jobs.Service/"]
COPY ["src/CloudCrafter.Infrastructure/CloudCrafter.Infrastructure.csproj", "src/CloudCrafter.Infrastructure/"]
COPY . .
RUN dotnet restore "src/CloudCrafter.Worker.Console/CloudCrafter.Worker.Console.csproj"
WORKDIR "/src/src/CloudCrafter.Worker.Console"
RUN dotnet build "CloudCrafter.Worker.Console.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "CloudCrafter.Worker.Console.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CloudCrafter.Worker.Console.dll"]
