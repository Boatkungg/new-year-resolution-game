FROM node:bookworm AS base

FROM base AS deps
RUN apt-get update
RUN apt-get install -y python3
RUN apt-get install -y build-essential
WORKDIR /app

COPY package.json yarn.lock* ./

RUN yarn --frozen-lockfile

FROM deps AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]