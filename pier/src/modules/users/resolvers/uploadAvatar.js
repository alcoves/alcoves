const { nanoid } = require('nanoid');
const sharp = require('sharp');
const fs = require('fs');
const User = require('../model');
const ws3 = require('../../../utils/ws3');

const { WASABI_BUCKET } = require('../../../utils/config');

async function processAvatar(tmpFile) {
  const avatar = await sharp(tmpFile).resize({
    width: 300,
    height: 300,
  }).webp({
    quality: 80,
    reductionEffort: 6,
  }).toBuffer();
  return avatar;
}

async function uploadAvatar(_, args, { user, authenticate }) {
  authenticate();
  const { createReadStream, filename } = await args.file;

  const uploadKey = `avatars/${user.id}/${nanoid()}.webp`;
  const url = `https://cdn.bken.io/${uploadKey}`;
  const tmpDir = fs.mkdtempSync('/tmp/');
  const tmpFile = `${tmpDir}/${filename}`;
  const tmpWriteStream = createReadStream().pipe(fs.createWriteStream(tmpFile));

  return new Promise((resolve) => {
    tmpWriteStream.on('finish', async () => {
      const avatar = await processAvatar(tmpFile);

      const { Contents } = await ws3.listObjectsV2({
        Bucket: WASABI_BUCKET,
        Prefix: `avatars/${user.id}`,
      }).promise();

      console.log(`removing ${Contents.length} old avatars`);
      await Promise.all(Contents.map(({ Key }) => {
        return ws3.deleteObject({ Key, Bucket: WASABI_BUCKET }).promise();
      }));

      await ws3.upload({
        Body: avatar,
        Key: uploadKey,
        Bucket: WASABI_BUCKET,
        ContentType: 'image/webp',
      }).promise();

      await User.findByIdAndUpdate(user.id, { avatar: url });
      resolve({ url });
    });
  });
}

module.exports = uploadAvatar;
module.exports.processAvatar = processAvatar;