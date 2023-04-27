# Depedencies
FROM node:18-alpine As development

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY . .

# Build
FROM node:18-alpine As build

WORKDIR /app
COPY package.json yarn.lock ./
COPY --from=development /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN yarn build
ENV NODE_ENV production
RUN yarn install --production --frozen-lockfile

# Production
FROM node:18-alpine As production

WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist

CMD [ "yarn", "start:prod" ]
