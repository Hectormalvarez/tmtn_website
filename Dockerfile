FROM node:22-alpine AS base

# 1. Production Dependency Resolution
# Only install system packages strictly required for npm packages (e.g. libc6-compat for Turbopack/SWC)
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# 2. Dedicated Development Target (VS Code / Dev Container)
# Install editor tools, shells, and git strictly here
FROM base AS dev
RUN apk add --no-cache libc6-compat git bash curl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV WATCHPACK_POLLING=true
EXPOSE 3000
CMD ["npm", "run", "dev"]

# 3. Production Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 4. Production Runtime (Minimal Attack Surface)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]