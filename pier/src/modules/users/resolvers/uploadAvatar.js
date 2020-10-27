const { nanoid } = require('nanoid');
const sharp = require('sharp');
const fs = require('fs');
const User = require('../model');
const ws3 = require('../../../utils/ws3');

async function uploadAvatar(_, args, { user, authenticate }) {
  authenticate();
  const { createReadStream, filename } = await args.file;

  const uploadKey = `avatars/${user.id}/${nanoid()}.webp`;
  const tmpDir = fs.mkdtempSync('/tmp/');
  const tmpFile = `${tmpDir}/${filename}`;
  const tmpWriteStream = createReadStream().pipe(fs.createWriteStream(tmpFile));

  return new Promise((resolve) => {
    tmpWriteStream.on('finish', async () => {
      const avatar = await sharp(tmpFile).resize({
        width: 300,
        height: 300,
      }).webp({
        quality: 80,
        reductionEffort: 6,
      }).toBuffer();

      await ws3.upload({
        Body: avatar,
        Key: uploadKey,
        Bucket: 'cdn.bken.io',
        ContentType: 'image/webp',
      }).promise();

      const url = `https://cdn.bken.io/${uploadKey}`;
      await User.findByIdAndUpdate(user.id, { avatar: url });
      resolve({ url });
    });
  });
}

module.exports = uploadAvatar;