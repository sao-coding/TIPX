
# syntax=docker/dockerfile:1

FROM node:26.12.1-trixie-slim

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0

WORKDIR /app

# Update OS packages and install runtime requirements for Prisma
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends \
        openssl \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && chown node:node /app

# Install pinned pnpm version
RUN npm install --global pnpm@10.10.0

USER node

# Install dependencies
COPY --chown=node:node package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY --chown=node:node . .
RUN pnpm build

# Remove development dependencies
RUN pnpm prune --prod

EXPOSE 3000

CMD ["pnpm", "start"]
