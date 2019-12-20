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

# Forward 80 to application port
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 1024;
}

http {
  sendfile            on;
  tcp_nopush          on;
  tcp_nodelay         on;
  keepalive_timeout   65;
  types_hash_max_size 2048;

  server {
    listen       80 default_server;
    listen       [::]:80 default_server;
    server_name  _;
    root         /usr/share/nginx/html;
    include /etc/nginx/default.d/*.conf;

    location / {
      proxy_pass  http://127.0.0.1:3000/;
    }
  }
}



# Start api server
mv ~/.env api/.env
cd api && yarn && yarn start