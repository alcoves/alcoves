FROM alpine:edge
LABEL author="Brendan Kennedy <brenwken@gmail.com>"

ARG BKEN_ENV

ENV BKEN_ENV=$BKEN_ENV
ENV NODE_ENV=production

RUN apk add --no-cache yarn nodejs curl

WORKDIR "/root"
COPY . .

RUN yarn
RUN yarn build

EXPOSE 3000
CMD ["sh", "-c", "yarn start"]