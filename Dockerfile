FROM node:18-alpine
WORKDIR /app

COPY . . 
RUN yarn --frozen-lockfile
RUN yarn build

EXPOSE 3000
ENV PORT 3000
CMD ["yarn", "start"]