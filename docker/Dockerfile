FROM node:18-slim as base
RUN corepack enable
WORKDIR /app

# Build stage
FROM base as builder

RUN apt update && apt install -y wget xz-utils
ENV FFMPEG_VERSION="ffmpeg-n6.0-latest-linux64-gpl-6.0"
RUN wget -q https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/${FFMPEG_VERSION}.tar.xz
RUN tar -xvf ${FFMPEG_VERSION}.tar.xz
RUN mv ${FFMPEG_VERSION}/bin/* /usr/bin/
RUN rm -rf ${FFMPEG_VERSION}*

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build
RUN yes | pnpm prune --prod

# Final stage
FROM base as final

# Required to run prisma migrations
RUN apt update && apt install -y openssl

COPY --from=builder /app /app/
COPY --from=builder /usr/bin/ffmpeg /usr/bin/ffmpeg
COPY --from=builder /usr/bin/ffprobe /usr/bin/ffprobe

EXPOSE 4000
CMD ["pnpm", "start"]
