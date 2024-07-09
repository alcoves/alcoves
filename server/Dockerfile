FROM oven/bun:latest
WORKDIR /app

RUN apt update && apt install -y wget xz-utils && rm -rf /var/lib/apt/lists/*

RUN wget -q https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-n7.0-latest-linux64-gpl-7.0.tar.xz && \
    tar -xvf ffmpeg-n7.0-latest-linux64-gpl-7.0.tar.xz && \
    mv ffmpeg-n7.0-latest-linux64-gpl-7.0/bin/ffmpeg /usr/local/bin/ffmpeg && \
    mv ffmpeg-n7.0-latest-linux64-gpl-7.0/bin/ffprobe /usr/local/bin/ffprobe && \
    rm -rf ffmpeg-n7.0-latest-linux64-gpl-7.0 && \
    rm ffmpeg-n7.0-latest-linux64-gpl-7.0.tar.xz

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
WORKDIR /app

COPY . .

EXPOSE 3000
CMD ["bun", "start:api"]