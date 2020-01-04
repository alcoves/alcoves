const s3 = require('../config/s3');
const mime = require('mime-types');
const Video = require('../models/video');
const convertObjectToDotNotation = require('../lib/convertObjectToDotNotation');

const { MEDIA_BUCKET_NAME } = require('../config/config');

const buildSourceFileKey = (id, fileType) => {
  return `${id}/highQuality.${mime.extension(fileType)}`;
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
          files: {
            highQuality: {
              status: 'completed',
              percentCompleted: 0,
              objectBucket: MEDIA_BUCKET_NAME,
              objectKey: buildSourceFileKey(video._id, req.body.fileType),
            },
          },
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
    res.status(200).send({
      message: 'query for video was successfull',
      payload: await Video.findOne({ _id: req.params.id }).populate(
        'author',
        '_id email userName'
      ),
    });
  } catch (error) {
    console.error(error);
    return res.status(404).send({
      message: 'not found',
    });
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
