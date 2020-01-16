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

    const avatarBuffer = await sharp(req.file.buffer)
      .extract(extractArea)
      .resize({
        width: 300,
        height: 300,
      })
      .jpeg({
        quality: 80,
        progressive: true,
      })
      .toBuffer();

    // TODO :: Should check before possibly overwriting
    const s3Res = await s3
      .upload({
        Body: avatarBuffer,
        Bucket: MEDIA_BUCKET_NAME,
        ContentType: 'image/jpeg',
        Key: `avatars/${req.user.id}/avatar.jpg`,
      })
      .promise();

    await User.updateOne(
      { _id: req.user.id },
      {
        $set: convertObjectToDotNotation({
          avatar: s3Res.Location,
        }),
      }
    );

    res.status(200).send({ message: 'set user avatar' });
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: 'bad request' });
  }
};
