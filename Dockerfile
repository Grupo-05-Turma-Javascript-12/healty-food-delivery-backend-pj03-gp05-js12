FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production && npm cache clean --force
USER nestjs
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 CMD wget -q0- http://localhost:4000/health || exit 1
CMD ["node", "dist/main.js"]