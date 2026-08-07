# Stage 1: Dependency installation
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY frontend/package.json ./
RUN npm install

# Stage 2: Development Runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=development
ENV PORT=3000

COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ ./

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["npm", "run", "dev"]
