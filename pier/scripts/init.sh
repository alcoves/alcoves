#!/bin/bash

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
npm i -g yarn

# Clone website
git clone https://github.com/bken-io/web

# Install certbot
add-apt-repository universe
add-apt-repository ppa:certbot/certbot -y
apt update
apt install -y certbot python-certbot-nginx

# Configure certbot
# https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx.html
certbot --nginx

# Deploy website
cd web
yarn
yarn deploy
cd ~
