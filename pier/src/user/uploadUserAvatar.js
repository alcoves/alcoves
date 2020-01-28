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
