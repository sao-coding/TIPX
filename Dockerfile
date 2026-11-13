FROM node:26.12.1-trixie-slim

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0

WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y --no-install-recommends \
        openssl \
        ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && chown node:node /app

# Install pnpm
RUN npm install --global pnpm@10.10.0

USER node

# Copy package files
COPY --chown=node:node package.json pnpm-lock.yaml ./

# Copy Prisma schema before installing dependencies.
# Prisma may run generate during installation.
COPY --chown=node:node prisma ./prisma

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy remaining application files
COPY --chown=node:node . .

# Build Next.js application
RUN pnpm build

# Remove development dependencies
RUN pnpm prune --prod

EXPOSE 3000

CMD ["pnpm", "start"]