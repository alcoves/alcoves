FROM node:16-alpine
WORKDIR /app

COPY . .

RUN yarn
RUN npx prisma generate
RUN yarn build

EXPOSE 4000
CMD yarn start