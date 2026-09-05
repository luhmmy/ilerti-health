# Production Dockerfile for ILERTI Health NestJS API
FROM node:20-alpine AS base
RUN npm install -g pnpm@9.15.0

WORKDIR /app

# Copy root workspace configs
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* turbo.json tsconfig.json* ./

# Copy packages and apps
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Install all workspace dependencies
RUN pnpm install

# Generate Prisma Client for PostgreSQL
WORKDIR /app/apps/api
RUN npx prisma generate

# Build shared library & API
WORKDIR /app
RUN pnpm --filter=@ilerti/shared build || true
RUN pnpm --filter=@ilerti/api build

EXPOSE 4000
ENV PORT=4000
ENV NODE_ENV=production

CMD ["pnpm", "--filter=@ilerti/api", "start:prod"]
