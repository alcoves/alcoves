FROM node:18-alpine AS build
WORKDIR /usr/src

COPY . .
RUN yarn --frozen-lockfile

ENV NODE_ENV=production
RUN yarn build

RUN npm prune --production

FROM node:18-alpine AS distribution
WORKDIR /opt/my-app
ENV NODE_ENV=production
COPY --from=build /usr/src/.next .next
COPY --from=build /usr/src/node_modules node_modules
COPY --from=build /usr/src/package.json package.json

EXPOSE 3000
ENV PORT 3000
CMD ["yarn", "start"]