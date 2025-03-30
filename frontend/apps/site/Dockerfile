FROM oven/bun:1 AS base
RUN bun install turbo@canary --global

FROM base AS builder

WORKDIR /app
COPY . .

# Prune the monorepo for the specific frontend workspace
RUN bunx turbo prune cloudcrafter-docs --docker

 
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
WORKDIR /app
 
# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/full/apps/site/source.config.ts ./apps/site/source.config.ts

RUN bun install

# Build the project
COPY --from=builder /app/out/full/ .

ENV NEXT_PUBLIC_BASE_URL=https://www.cloudcrafter.app
RUN bunx turbo run build --filter=cloudcrafter-docs
 
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