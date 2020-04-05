FROM alpine:edge

ARG GITHUB_WORKSPACE

ENV NODE_ENV=production
ENV GITHUB_WORKSPACE=$GITHUB_WORKSPACE

RUN apk add --update --no-cache \
  yarn \
  nodejs

WORKDIR "/root"
COPY $GITHUB_WORKSPACE/ .
RUN ls -la

WORKDIR "/root/web"
RUN yarn