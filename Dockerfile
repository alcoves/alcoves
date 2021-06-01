FROM node:16-alpine AS deps

WORKDIR /opt/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:16-alpine AS builder

ENV NODE_ENV=production
WORKDIR /opt/app
COPY . .
COPY --from=deps /opt/app/node_modules ./node_modules
RUN yarn build

FROM node:16-alpine AS runner

ARG REACT_APP_GIT_SHA

ENV NODE_ENV="production"
ENV NEXT_TELEMETRY_DISABLED=1
ENV REACT_APP_GIT_SHA=${REACT_APP_GIT_SHA}

WORKDIR /opt/app

COPY --from=builder /opt/app/prisma ./prisma
COPY --from=builder /opt/app/public ./public
COPY --from=builder /opt/app/.next ./.next
COPY --from=builder /opt/app/node_modules ./node_modules
COPY --from=builder /opt/app/package.json ./package.json

EXPOSE 3000
CMD ["yarn", "start"]