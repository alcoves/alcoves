FROM node:16-alpine

COPY . .

RUN yarn
RUN yarn build

EXPOSE 3100
CMD yarn start