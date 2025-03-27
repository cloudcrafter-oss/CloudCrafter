FROM oven/bun:1 AS base

FROM base AS builder

WORKDIR /app
COPY . .

# Prune the monorepo for the specific frontend workspace
RUN bunx turbo prune cloudcrafter-frontend --docker

FROM base AS installer
WORKDIR /app

# First install dependencies
COPY --from=builder /app/out/json/ .
RUN bun install

# Build the project
COPY --from=builder /app/out/full/ .
ARG CLOUDCRAFTER_AXIOS_BACKEND_BASEURL
ENV CLOUDCRAFTER_AXIOS_BACKEND_BASEURL=${CLOUDCRAFTER_AXIOS_BACKEND_BASEURL}
RUN bunx turbo run build --filter=cloudcrafter-frontend

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copy production files
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

CMD node apps/web/server.js