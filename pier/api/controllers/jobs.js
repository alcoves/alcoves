const shortid = require('shortid');
const Do = require('do-wrapper').default;

const api = new Do(process.env.DO_API_KEY, [10]);

exports.createJob = async (req, res) => {
  const { body } = await api.accountGetKeys();

  const sshKeyIds = body.ssh_keys.map(({ id }) => {
    return id;
  });

  const bashInit = [
    'sleep 30',
    'apt update',
    'apt install -y git nodejs npm ffmpeg',
    'snap install doctl',
    'npm i -g yarn',
    'cd /root',
    'git clone https://github.com/bken-io/video',
    'cd video',
    'yarn',
    `echo "DO_SPACES_ACCESS_KEY_ID=${process.env.DO_SPACES_ACCESS_KEY_ID}" >> .env`,
    `echo "DO_SPACES_SECRET_ACCESS_KEY=${process.env.DO_SPACES_SECRET_ACCESS_KEY}" >> .env`,
    `echo "WASABI_ACCESS_KEY_ID=${process.env.WASABI_ACCESS_KEY_ID}" >> .env`,
    `echo "WASABI_SECRET_ACCESS_KEY=${process.env.WASABI_SECRET_ACCESS_KEY}" >> .env`,
    `echo "CONVERSION_API_KEY=${process.env.CONVERSION_API_KEY}" >> .env`,
    `echo "NODE_ENV=production" >> .env`,
    `node cli.js --type=video --preset=all --id=${req.body.videoId}`,
    'echo shutting system down',
  ].join(' && ');

  const cloudInit = `
  #cloud-config
  runcmd:
    - ${bashInit}
  `;

  console.log(cloudInit);

  const createEvent = await api.dropletsCreate({
    ipv6: true,
    tags: ['worker'],
    volumes: null,
    region: 'nyc3',
    backups: false,
    user_data: cloudInit,
    name: `worker-${shortid()}`,
    size: '1gb',
    ssh_keys: sshKeyIds,
    private_networking: null,
    image: 'ubuntu-18-04-x64',
  });

  res.status(202).send({
    message: `job created`,
    payload: createEvent.body,
  });
};
