FROM alpine:edge

ENV NODE_ENV=production

RUN apk add --update --no-cache \
  yarn \
  nodejs

WORKDIR "/root"
COPY . .
RUN ls

WORKDIR "/root/web"
RUN yarn