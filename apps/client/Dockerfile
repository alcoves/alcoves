FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
