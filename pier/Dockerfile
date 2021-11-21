FROM node:16-alpine

COPY . .

RUN yarn
RUN yarn build

EXPOSE 4000
CMD yarn start