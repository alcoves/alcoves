FROM alpine:edge
LABEL author="Brendan Kennedy <brenwken@gmail.com>"

ARG GIT_SHA
ARG BKEN_ENV

ENV GIT_SHA=$GIT_SHA
ENV BKEN_ENV=$BKEN_ENV
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
RUN yarn build

EXPOSE 80
CMD ["sh", "-c", "BKEN_ENV=dev yarn start"]