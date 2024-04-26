FROM oven/bun:latest
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .

EXPOSE 3005
CMD ["bun", "dev"]