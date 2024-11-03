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
RUN apk add --no-cache bash curl git git-lfs openssh-client tar tini
USER root
RUN mkdir -p ~/.docker/cli-plugins

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
    (curl -sSL https://download.docker.com/linux/static/stable/aarch64/docker-${DOCKER_VERSION}.tgz | tar -C /usr/bin/ --no-same-owner -xzv --strip-components=1 docker/docker) && \
    (curl -sSL https://github.com/buildpacks/pack/releases/download/v${PACK_VERSION}/pack-v${PACK_VERSION}-linux-arm64.tgz | tar -C /usr/local/bin/ --no-same-owner -xzv pack) && \
    curl -sSL https://nixpacks.com/install.sh | bash && \
    chmod +x ~/.docker/cli-plugins/docker-compose /usr/bin/docker /usr/local/bin/pack /root/.docker/cli-plugins/docker-buildx \
    ;fi


WORKDIR /app



FROM --platform=$BUILDPLATFORM  mcr.microsoft.com/dotnet/sdk:8.0 AS build
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
# RUN echo '#!/bin/sh' > /usr/local/bin/cloudcrafter-agent && \
#     echo 'dotnet /console/CloudCrafter.Agent.Console.dll "$@"' >> /usr/local/bin/cloudcrafter-agent && \
#     chmod +x /usr/local/bin/cloudcrafter-agent



ENTRYPOINT ["dotnet", "CloudCrafter.Agent.Console.dll"]

# ENTRYPOINT ["/sbin/tini", "--"]
# # Set the entrypoint to a shell
# CMD ["tail", "-f", "/dev/null"]