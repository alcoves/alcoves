FROM ubuntu:22.04

RUN apt update
RUN apt install -y curl wget xz-utils unzip

RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt install -y nodejs
RUN npm install --global yarn

ENV FFMPEG_VERSION="ffmpeg-n6.0-latest-linux64-gpl-6.0"
RUN wget -q https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/${FFMPEG_VERSION}.tar.xz
RUN tar -xvf ${FFMPEG_VERSION}.tar.xz
RUN mv ${FFMPEG_VERSION}/bin/* /usr/bin/
RUN rm -rf ${FFMPEG_VERSION}*

WORKDIR /app

COPY package.json yarn.lock ./
RUN npm install --platform=linux --arch=x64 sharp
RUN yarn install --frozen-lockfile

COPY . .
RUN npx prisma generate

RUN yarn build

EXPOSE 4005
CMD [ "yarn", "start:prod" ]
