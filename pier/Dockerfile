FROM alpine:edge
LABEL author="Brendan Kennedy <brenwken@gmail.com>"

ARG GIT_SHA

ENV PORT=80
ENV GIT_SHA=$GIT_SHA
ENV NODE_ENV=production
ENV REPO_URL="https://github.com/bken-io/api.git"

RUN apk add --update --no-cache \
  git \
  yarn \
  nodejs

WORKDIR "/root"
RUN git clone $REPO_URL

WORKDIR "/root/api"
RUN git reset --hard $GIT_SHA

RUN yarn

EXPOSE 80
CMD ["node", "./src/server.js"]