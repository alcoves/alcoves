FROM alpine:edge
LABEL author="Brendan Kennedy <brenwken@gmail.com>"

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

RUN yarn global add parcel
RUN yarn global add serve

RUN yarn
RUN yarn build

EXPOSE 5000
CMD ["serve", "-p", "5000", "dist"]