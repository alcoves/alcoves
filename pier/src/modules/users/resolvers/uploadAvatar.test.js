const sharp = require('sharp');
const fs = require('fs-extra');
const crypto = require('crypto');
const { processAvatar } = require('./uploadAvatar');

describe('avatar tests', () => {
  test('should process an avatar', async () => {
    await fs.mkdirp('./tmp');
    const tmpFilePath = './tmp/tmp.webp';
    await sharp({
      create: {
        width: 300,
        height: 200,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 0.5 },
      },
    })
      .webp()
      .toFile(tmpFilePath);
    const avatar = await processAvatar(tmpFilePath);
    const hash = crypto.createHash('sha256').update(avatar).digest('hex');
    expect(hash).toEqual('4043deb85973553ea142450e9baba9996b7372c9cf5fcc93c1e1f003c899eb43');
  });
});