FROM mhart/alpine-node:14

ENV PORT 3000

RUN apk add git

WORKDIR /usr/src/app
COPY .  /usr/src/app/

RUN yarn install --production
RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]