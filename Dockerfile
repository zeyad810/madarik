# syntax=docker/dockerfile:1

##### 1. Base image with pnpm enabled #####
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate

##### 2. Install dependencies only (cached layer) #####
FROM base AS deps
WORKDIR /app

# Copy only what's needed to resolve deps -> better layer caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

##### 3. Build the application #####
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# NEXT_PUBLIC_* vars are baked into the client bundle at BUILD time,
# so they must be passed as a build ARG, not a runtime env var.
# ARG NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm build

##### 4. Production runtime image #####
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy everything needed to run `next start` (no standalone output)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node_modules/.bin/next", "start"]