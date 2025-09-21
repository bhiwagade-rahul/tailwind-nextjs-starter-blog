# Use Node.js 20 Alpine (Corepack is included)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies (including Corepack)
RUN apk add --no-cache curl bash

# Enable Corepack and prepare the correct Yarn version (3.6.1 from package.json)
RUN corepack enable && corepack prepare yarn@3.6.1 --activate

# Copy package files
COPY package.json yarn.lock ./

# Copy rest of the app
COPY . .

# Allow Contentlayer and chokidar to work inside Docker
ENV CHOKIDAR_USEPOLLING=true

RUN yarn install
# Expose the Next.js dev server port
EXPOSE 3000

# Start dev server bound to all interfaces
CMD ["yarn", "dev"]
