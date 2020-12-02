FROM mhart/alpine-node:14

ENV PORT 3000

WORKDIR /usr/src/app

COPY new/pages /usr/src/app/pages
COPY new/public /usr/src/app/public
COPY new/styles /usr/src/app/styles
COPY new/yarn.lock /usr/src/app/yarn.lock
COPY new/package.json /usr/src/app/package.json

RUN yarn install --production
RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]