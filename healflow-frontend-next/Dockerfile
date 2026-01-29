# ---- Base image ----
FROM oven/bun:1.3 AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY bun.lock package.json ./
RUN bun install --frozen-lockfile

# ---- Build ----
FROM deps AS build
COPY . .
RUN bun run build

# ---- Production ----
FROM oven/bun:1.3 AS production
WORKDIR /app

# Copy only what's needed for runtime
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "run", "start"]
