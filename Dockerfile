FROM node:16-alpine

ENV PORT 3000
ENV NODE_ENV="production"

RUN apk add git

WORKDIR /usr/src/app
COPY .  /usr/src/app/

RUN yarn install --production
RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]