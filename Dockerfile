# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install production dependencies for the server
COPY package*.json ./
RUN npm ci --omit=dev

# Copy server file and built assets
COPY --from=build /app/dist ./dist
COPY server.js .

# Expose port and start server
EXPOSE 3000
CMD ["node", "server.js"] 