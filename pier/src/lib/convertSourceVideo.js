const doco = require('./do');

module.exports = async ({ videoId }) => {
  const { data } = await doco({
    method: 'get',
    url: '/v2/account/keys',
  });

  const sshKeyIds = data.ssh_keys.map(({ id }) => {
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
    `echo "DISCORD_WEBHOOK_URL=${process.env.DISCORD_WEBHOOK_URL}" >> .env`,
    `echo "DO_API_KEY=${process.env.DO_API_KEY}" >> .env`,
    `echo "NODE_ENV=production" >> .env`,
    'chmod +x scripts/terminate.sh',
    `nohup node cli.js --videoId=${videoId} --type=all &`,
  ].join(' && ');

  const cloudInit = `
  #cloud-config
  runcmd:
    - ${bashInit}
  `;

  return doco({
    method: 'post',
    url: '/v2/droplets',
    data: {
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
      image: 58402576,
      name: `worker`,
    },
  });
};
