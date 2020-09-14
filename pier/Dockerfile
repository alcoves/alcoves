FROM node:12-slim

COPY package.json ./

RUN yarn install --production

EXPOSE 4000

CMD [ "yarn", "start" ]
