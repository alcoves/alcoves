# https://nextjs.org/docs/deployment
FROM node:16-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

ENV NEXT_PUBLIC_API_URL="https://api.bken.io"
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID="432277291238-ne4inevmqif8a3sp4su8tle443ovbfp3.apps.googleusercontent.com"

RUN yarn build && yarn install --production --ignore-scripts --prefer-offline && rm -rf .next/.cache

FROM node:16-alpine AS runner
WORKDIR /app

ENV PORT 3000
ENV NODE_ENV production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "start"]
