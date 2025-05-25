FROM oven/bun:1 AS base

ENV DIR=/app
WORKDIR $DIR

FROM base AS dev

ENV NODE_ENV=development
ENV PORT=3010

# Install OpenSSL
RUN apt-get update -y && apt-get install -y openssl

# Copy configuration files first
COPY tsconfig*.json ./
COPY prisma/ prisma/

# Copy package.json and install dependencies
COPY package.json ./
COPY bun.lock ./
RUN bun install

# Generate Prisma Client
RUN bunx prisma generate

# Copy source code
COPY src/ src/

EXPOSE $PORT
CMD ["bun", "--hot", "src/main.ts"]

FROM base AS build

ENV NODE_ENV=production

# Install OpenSSL
RUN apt-get update -y && apt-get install -y openssl

# Copy configuration files first
COPY tsconfig*.json ./
COPY prisma/ prisma/

# Copy package.json and install dependencies
COPY package.json ./
COPY bun.lock ./
RUN bun install

# Generate Prisma Client
RUN bunx prisma generate

# Copy source code
COPY src/ src/

# Build the application
RUN bun run build

FROM base AS production

ENV NODE_ENV=production
ENV PORT=3010
ENV USER=bun

# Install OpenSSL
RUN apt-get update -y && apt-get install -y openssl

# Copy necessary files from build stage
COPY --from=build $DIR/package.json ./
COPY --from=build $DIR/bun.lock ./
COPY --from=build $DIR/prisma/ prisma/
COPY --from=build $DIR/dist/ dist/

# Install production dependencies and generate Prisma Client
RUN bun install --production && bunx prisma generate

USER $USER
EXPOSE $PORT
CMD ["bun", "dist/main.js"]
