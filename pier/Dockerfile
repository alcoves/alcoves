FROM node:16-alpine
WORKDIR /app

COPY . .

RUN yarn
ADD .prisma node_modules/.prisma/
RUN yarn build

EXPOSE 4000
CMD yarn start