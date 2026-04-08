# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (layer caching)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# ---- Production Stage ----
FROM node:20-alpine AS production

WORKDIR /app

# Copy only what's needed from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Don't copy .env — pass via Docker env vars or host env
# Expose the app port
EXPOSE 8080

# Start the server
CMD ["node", "src/index.js"]
