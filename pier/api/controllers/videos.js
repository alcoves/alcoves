const s3 = require('../config/s3');
const mime = require('mime-types');
const mongoose = require('mongoose');

const Video = require('../models/video');
const View = require('../models/view');

const convertObjectToDotNotation = require('../lib/convertObjectToDotNotation');

const { MEDIA_BUCKET_NAME } = require('../config/config');

const buildSourceFileKey = (id, fileType) => {
  return `${id}/source.${mime.extension(fileType)}`;
};

const emptyS3Dir = async (Prefix) => {
  const Bucket = MEDIA_BUCKET_NAME;
  const { Contents } = await s3.listObjectsV2({ Bucket, Prefix }).promise();
  return Promise.all(
    Contents.map(({ Key }) => {
      console.log(`Deleting ${Key}`);
      return s3.deleteObject({ Bucket, Key }).promise();
    })
  );
};

exports.createMultipartUpload = async (req, res) => {
  try {
    const video = await Video({
      status: 'uploading',
      author: req.user.id,
      title: req.body.fileName,
    }).save();

    // This should really happen on multipart upload complete, not create
    await Video.updateOne(
      { _id: video._id },
      {
        $set: convertObjectToDotNotation({
          sourceFile: `${MEDIA_BUCKET_NAME}/${buildSourceFileKey(
            video._id,
            req.body.fileType
          )}`,
        }),
      }
    );

    const { UploadId, Key } = await s3
      .createMultipartUpload({
        Bucket: MEDIA_BUCKET_NAME,
        Key: buildSourceFileKey(video._id, req.body.fileType),
        ContentType: req.body.fileType,
      })
      .promise();

    res.status(200).send({
      message: 'started multipart upload',
      payload: {
        key: Key,
        uploadId: UploadId,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getVideos = async (req, res) => {
  try {
    res.status(200).send({
      message: 'query for videos was successfull',
      payload: await Video.find({ author: req.user.id })
        .populate('author', '_id email userName')
        .sort({
          createdAt: 'descending',
        }),
    });
  } catch (error) {
    console.error(error);
    return res.status(404).send({
      message: 'not found',
    });
  }
};

exports.getVideo = async (req, res) => {
  try {
    const referrer = req.get('Referrer');

    if (referrer && referrer.includes('https://bken.io')) {
      const view = new View({
        _id: mongoose.Types.ObjectId(),
        videoId: req.params.id,
        // TODO :: Since getVideo is not an authed route, we don't have the userId here, we should have
        // two auth middlewares, requireAuth, and optionalAuth
      });

      await view.save();
      await Video.updateOne({ _id: req.params.id }, { $inc: { views: 1 } });
    }

    const video = await Video.findOne({ _id: req.params.id }).populate(
      'author',
      '_id email userName'
    );

    if (video) {
      res.status(200).send({
        message: 'query for video was successfull',
        payload: video,
      });
    } else {
      return res.status(404).send({
        message: 'not found',
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateVideo = async (req, res) => {
  try {
    res.status(200).send({
      message: 'post patched successfully',
      payload: await Video.updateOne(
        { _id: req.params.id },
        { $set: convertObjectToDotNotation(req.body) }
      ),
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    await emptyS3Dir(req.params.id);
    const result = await Video.deleteOne({ _id: req.params.id });
    if (result.deletedCount >= 1) {
      res.status(200).send({ message: 'video deleted' });
    } else {
      res.status(400).send({ message: 'video was not deleted' });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
