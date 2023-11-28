FROM node:18

RUN apt update
RUN apt install -y wget xz-utils

ENV FFMPEG_VERSION="ffmpeg-n6.0-latest-linux64-gpl-6.0"
RUN wget -q https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/${FFMPEG_VERSION}.tar.xz
RUN tar -xvf ${FFMPEG_VERSION}.tar.xz
RUN mv ${FFMPEG_VERSION}/bin/* /usr/bin/
RUN rm -rf ${FFMPEG_VERSION}*

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
RUN npx prisma generate
RUN yarn build

EXPOSE 3000
EXPOSE 4000

CMD [ "yarn", "start:prod" ]