FROM node:12-slim

RUN mkdir -p api

WORKDIR /api

COPY package.json ./

RUN yarn install --production

EXPOSE 4000

CMD [ "node", "/api/src/index.js" ]
