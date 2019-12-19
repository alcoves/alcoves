#!/bin/bash

# From client
scp .env bapi:~/.env

# From server

# Update deps
apt update

# Install deps
apt install -y \
  software-properties-common \
  nginx \
  git \
  htop \
  vnstat \
  wget \
  curl \
  sudo

# Install node deps
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
apt install -y nodejs
npm i -g yarn pm2

# Clone website
git clone https://github.com/bken-io/api

# Install certbot
# add-apt-repository universe
# add-apt-repository ppa:certbot/certbot -y
# apt update
# apt install -y certbot python-certbot-nginx

# Configure certbot
# https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx.html
# certbot --nginx

# Download secrets and store them on disk
# .env

# Start api server
mv ~/.env api/.env
cd api && yarn && yarn start