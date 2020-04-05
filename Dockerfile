FROM alpine:edge
MAINTAINER  Brendan Kennedy <brenwken@gmail.com>

ARG GIT_SHA

ENV GIT_SHA=$GIT_SHA
ENV NODE_ENV=production
ENV REPO_URL="https://github.com/bken-io/web.git"

RUN apk add --update --no-cache \
  git \
  yarn \
  nodejs

WORKDIR "/root"
RUN git clone $REPO_URL

WORKDIR "/root/web"
RUN git reset --hard $GIT_SHA
RUN yarn

EXPOSE 5000
CMD ["yarn", "start"]