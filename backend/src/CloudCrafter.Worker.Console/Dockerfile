FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS base




ARG TARGETPLATFORM
# https://download.docker.com/linux/static/stable/
ARG DOCKER_VERSION=26.1.3
# https://github.com/docker/compose/releases
ARG DOCKER_COMPOSE_VERSION=2.27.1
# https://github.com/docker/buildx/releases
ARG DOCKER_BUILDX_VERSION=0.14.1
# https://github.com/buildpacks/pack/releases
ARG PACK_VERSION=0.35.1
# https://github.com/railwayapp/nixpacks/releases
ARG NIXPACKS_VERSION=1.28.0
USER root
RUN apk add --no-cache git bash tar curl

RUN mkdir -p ~/.docker/cli-plugins

RUN echo "TARGETPLATFORM: ${TARGETPLATFORM}" > /targetplatform.txt

RUN if [[ ${TARGETPLATFORM} == 'linux/amd64' ]]; then \
    curl -sSL https://github.com/docker/buildx/releases/download/v${DOCKER_BUILDX_VERSION}/buildx-v${DOCKER_BUILDX_VERSION}.linux-amd64 -o ~/.docker/cli-plugins/docker-buildx && \
    curl -sSL https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose && \
    (curl -sSL https://download.docker.com/linux/static/stable/x86_64/docker-${DOCKER_VERSION}.tgz | tar -C /usr/bin/ --no-same-owner -xzv --strip-components=1 docker/docker) && \
    (curl -sSL https://github.com/buildpacks/pack/releases/download/v${PACK_VERSION}/pack-v${PACK_VERSION}-linux.tgz | tar -C /usr/local/bin/ --no-same-owner -xzv pack) && \
    curl -sSL https://nixpacks.com/install.sh | bash && \
    chmod +x ~/.docker/cli-plugins/docker-compose /usr/bin/docker /usr/local/bin/pack /root/.docker/cli-plugins/docker-buildx \
    ;fi

RUN if [[ ${TARGETPLATFORM} == 'linux/arm64' ]]; then \
    curl -sSL https://github.com/docker/buildx/releases/download/v${DOCKER_BUILDX_VERSION}/buildx-v${DOCKER_BUILDX_VERSION}.linux-arm64 -o ~/.docker/cli-plugins/docker-buildx && \
    curl -sSL https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-linux-aarch64 -o ~/.docker/cli-plugins/docker-compose && \
    curl -sSL https://download.docker.com/linux/static/stable/aarch64/docker-${DOCKER_VERSION}.tgz | tar -C /usr/bin/ --no-same-owner -xzv --strip-components=1 docker/docker && \
    curl -sSL https://github.com/buildpacks/pack/releases/download/v${PACK_VERSION}/pack-v${PACK_VERSION}-linux-arm64.tgz | tar -C /usr/local/bin/ --no-same-owner -xzv pack && \
    curl -sSL https://nixpacks.com/install.sh | bash && \
    chmod +x ~/.docker/cli-plugins/docker-compose /usr/bin/docker /usr/local/bin/pack /root/.docker/cli-plugins/docker-buildx \
    ;fi




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
