const Do = require('do-wrapper').default;
const api = new Do(process.env.DO_API_KEY, [50]);

module.exports = async ({ videoId }) => {
  const { body } = await api.accountGetKeys();

  const sshKeyIds = body.ssh_keys.map(({ id }) => {
    return id;
  });

  const bashInit = [
    'cd /root/video',
    'git pull',
    'yarn',
    `echo "DO_SPACES_ACCESS_KEY_ID=${process.env.DO_SPACES_ACCESS_KEY_ID}" >> .env`,
    `echo "DO_SPACES_SECRET_ACCESS_KEY=${process.env.DO_SPACES_SECRET_ACCESS_KEY}" >> .env`,
    `echo "WASABI_ACCESS_KEY_ID=${process.env.WASABI_ACCESS_KEY_ID}" >> .env`,
    `echo "WASABI_SECRET_ACCESS_KEY=${process.env.WASABI_SECRET_ACCESS_KEY}" >> .env`,
    `echo "CONVERSION_API_KEY=${process.env.CONVERSION_API_KEY}" >> .env`,
    `echo "DO_API_KEY=${process.env.DO_API_KEY}" >> .env`,
    `echo "NODE_ENV=production" >> .env`,
    'chmod +x scripts/terminate.sh',
    `nohup node cli.js --videoId=${videoId} --type=all >> out.log &`,
  ].join(' && ');

  const cloudInit = `
  #cloud-config
  runcmd:
    - ${bashInit}
  `;

  return api.dropletsCreate({
    ipv6: true,
    volumes: null,
    region: 'nyc3',
    backups: false,
    tags: ['worker'],
    monitoring: true,
    ssh_keys: sshKeyIds,
    size: '1gb',
    user_data: cloudInit,
    private_networking: null,
    image: 57308931,
    name: `worker`,
  });
};
