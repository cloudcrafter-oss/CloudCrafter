FROM node:20-bookworm AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm add --global turbo@^2
RUN apk add --no-cache wget curl

 
FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
# RUN yarn global add turbo@^2
COPY . .
 
# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Assuming "web" is the name entered in the project's package.json: { name: "web" }
RUN pnpm turbo prune cloudcrafter-docs --docker
 
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update

RUN echo "https://dl-cdn.alpinelinux.org/alpine/edge/main" > /etc/apk/repositories \
&& echo "https://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
&& echo "https://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories \
&& echo "https://dl-cdn.alpinelinux.org/alpine/v3.16/main" >> /etc/apk/repositories \
&& echo "https://dl-cdn.alpinelinux.org/alpine/v3.16/community" \
&& apk upgrade -U -a \
&& apk add \
libstdc++ \
chromium \
harfbuzz \
nss \
freetype \
ttf-freefont \
font-noto-emoji \
wqy-zenhei \
libc6-compat \
&& rm -rf /var/cache/* \
&& mkdir /var/cache/apk

ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PLAYWRIGHT_NODEJS_PATH=/usr/bin/node

WORKDIR /app
 
# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/full/apps/site/source.config.ts ./apps/site/source.config.ts

RUN pnpm install
RUN cd apps/site && pnpm exec playwright install && npx playwright install-deps
# Build the project
COPY --from=builder /app/out/full/ .

ENV NEXT_PUBLIC_BASE_URL=https://www.cloudcrafter.app
RUN pnpm turbo run build --filter=cloudcrafter-docs
 
FROM base AS runner
WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
 
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/site/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/site/.next/static ./apps/site/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/site/public ./apps/site/public
 
CMD node apps/site/server.js