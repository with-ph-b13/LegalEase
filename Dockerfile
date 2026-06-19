# Step 1: Base Image
FROM node:22-alpine AS base
RUN npm install -g pnpm

# Step 2: Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
RUN pnpm install --frozen-lockfile

# Step 3: Builder
FROM deps AS builder
WORKDIR /app
COPY . .
# Build backend
RUN cd backend && pnpm build
# Build Next.js frontend
ENV NEXT_PUBLIC_API_URL=""
RUN pnpm build

# Step 4: Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/backend/package.json /app/backend/dist ./backend/dist/
COPY --from=builder /app/backend/node_modules ./backend/node_modules/
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/.next ./.next/
COPY --from=builder /app/public ./public/
COPY --from=builder /app/server.js ./server.js

EXPOSE 3000

CMD ["node", "server.js"]
