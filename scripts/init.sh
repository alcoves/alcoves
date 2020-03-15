# Update deps
sudo apt update && sudo apt upgrade -y

# Install nginx
apt install -y nginx

# Install nginx.conf

# Install node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
nvm install 12

# Update global npm packages
npm i -g npm yarn

# Clone bken web
git clone https://github.com/bken-io/web.git
