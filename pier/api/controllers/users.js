const sharp = require('sharp');
const mime = require('mime-types');
const s3 = require('../config/s3');
const User = require('../models/user');
const Video = require('../models/video');
const convertObjectToDotNotation = require('../lib/convertObjectToDotNotation');

const { MEDIA_BUCKET_NAME } = require('../config/config');

exports.getUserById = async (req, res) => {
  try {
    res.status(200).send({
      message: 'successfully fetched user',
      payload: await User.findOne({ _id: req.params.userId }).select(
        '-password -email'
      ),
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: 'bad request' });
  }
};

exports.getUserVideosByUserId = async (req, res) => {
  try {
    res.status(200).send({
      message: 'successfully fetched user videos',
      payload: await Video.find({ user: req.params.userId }).sort({
        createdAt: 'descending',
      }),
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: 'bad request' });
  }
};

exports.uploadUserAvatar = async (req, res) => {
  try {
    if (req.file.size / (1024 * 1024) > 1) {
      return res.status(413).end();
    }

    console.log('file', req.file);
    const { height, width } = await sharp(req.file.buffer).metadata();
    let extractArea = {};

    if (height > width) {
      extractArea = {
        left: 0,
        top: parseInt((height - width) / 2),
        width: width,
        height: width,
      };
    } else {
      extractArea = {
        left: parseInt((width - height) / 2),
        top: 0,
        width: height,
        height: height,
      };
    }

    const smallAvatar = await sharp(req.file.buffer)
      .extract(extractArea)
      .resize({
        width: 40,
        height: 40,
      })
      .webp({
        quality: 75,
      })
      .toBuffer();

    const largeAvatar = await sharp(req.file.buffer)
      .extract(extractArea)
      .resize({
        width: 200,
        height: 200,
      })
      .webp({
        quality: 80,
      })
      .toBuffer();

    const s3OrigRes = await s3
      .upload({
        Body: req.file.buffer,
        Bucket: MEDIA_BUCKET_NAME,
        ContentType: req.file.mimetype,
        Key: `avatars/${req.user.id}/original.${mime.extension(
          req.file.mimetype
        )}`,
      })
      .promise();

    const s3SmRes = await s3
      .upload({
        Body: smallAvatar,
        Bucket: MEDIA_BUCKET_NAME,
        ContentType: 'image/webp',
        Key: `avatars/${req.user.id}/avatar-sm.jpg`,
      })
      .promise();

    const s3LgRes = await s3
      .upload({
        Body: largeAvatar,
        Bucket: MEDIA_BUCKET_NAME,
        ContentType: 'image/webp',
        Key: `avatars/${req.user.id}/avatar-lg.jpg`,
      })
      .promise();

    await User.updateOne(
      { _id: req.user.id },
      {
        $set: convertObjectToDotNotation({
          avatars: {
            sm: { link: s3SmRes.Location },
            lg: { link: s3LgRes.Location },
            original: { link: s3OrigRes.Location },
          },
        }),
      }
    );

    res.status(200).send({ message: 'set user avatar' });
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: 'bad request' });
  }
};
