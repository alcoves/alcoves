FROM alpine:latest

RUN apk add --no-cache nodejs yarn

COPY . .

RUN yarn
RUN yarn build

EXPOSE 3100
CMD yarn start