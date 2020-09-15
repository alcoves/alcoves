FROM node:12-slim

RUN mkdir -p api

WORKDIR /api

COPY . .

RUN yarn install --production

EXPOSE 4000

CMD [ "yarn", "start" ]
