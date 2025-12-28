# Stage 1
FROM oven/bun:1.2.16-alpine AS base
WORKDIR /usr/src/app

COPY package.json bun.lock ./
# Use bun for speedy installs
RUN bun install

################################################################################
# Stage 2 — Build stage
FROM base AS builder

RUN apk add --no-cache nodejs npm

COPY --from=base /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

################################################################################
# Stage 3 — Final stage
FROM builder AS final

RUN addgroup --system bunjs && \
    adduser --system --ingroup bunjs qwik && \
    chown -R qwik:bunjs /usr/src/app

COPY --chown=qwik:bunjs package.json .
COPY --from=builder --chown=qwik:bunjs /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=qwik:bunjs /usr/src/app/dist ./dist
COPY --from=builder --chown=qwik:bunjs /usr/src/app/server ./server

USER qwik
EXPOSE 3000

CMD ["bun", "run", "serve"]