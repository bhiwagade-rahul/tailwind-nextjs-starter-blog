# -----------------------
# Stage 1 — Build Stage
# -----------------------
FROM node:20-alpine AS builder

# Enable Corepack and install Yarn 3.6.1
RUN corepack enable && corepack prepare yarn@3.6.1 --activate

# Set working directory
WORKDIR /app

# Install build tools
RUN apk add --no-cache bash curl

# Copy dependency files
COPY package.json yarn.lock .yarnrc.yml ./

# Install dependencies (including devDependencies for build)
RUN yarn install --immutable

# Copy app source code
COPY . .

# Build the Next.js app
RUN yarn build

# ------------------------------
# Stage 2 — Runtime (Production)
# ------------------------------
FROM node:20-alpine AS runner

# Enable Corepack and install Yarn (optional but keeps CLI tools consistent)
RUN corepack enable && corepack prepare yarn@3.6.1 --activate

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Set working directory
WORKDIR /app

# Install required system dependencies
RUN apk add --no-cache curl

# Copy only production deps
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable --production

# Copy built app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/package.json ./package.json

# Optional: If using any other files (env, etc.)
# COPY --from=builder /app/.env ./

# Expose the port Next.js will run on
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["yarn", "start"]
