FROM alpine:edge

ENV NODE_ENV=production

RUN apk add --update --no-cache \
  jq \
  git \
  npm \
  yarn \
  bash \
  curl \
  wget \
  ffmpeg \
  awscli \
  nodejs

WORKDIR "/root"
COPY . .
RUN ls

WORKDIR "/root/web"
RUN yarn