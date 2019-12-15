const AWS = require('aws-sdk');
const BUCKET_NAME = 'media-bken';

const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint('https://s3.us-east-2.wasabisys.com'),
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

exports.createMultipartUpload = async (req, res) => {
  try {
    const { UploadId: uploadId } = await s3
      .createMultipartUpload({
        Bucket: BUCKET_NAME,
        Key: req.query.fileName,
        ContentType: req.query.fileType,
      })
      .promise();

    res.status(200).send({
      message: 'started multipart upload successfully',
      payload: { uploadId },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getUploadUrl = async (req, res) => {
  try {
    res.send({
      message: 'created signed url successfully',
      payload: {
        url: s3.getSignedUrl('uploadPart', {
          Bucket: BUCKET_NAME,
          Key: req.query.fileName,
          PartNumber: req.query.partNumber,
          UploadId: req.query.uploadId,
        }),
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.completeMultipartUpload = async (req, res) => {
  try {
    const data = await s3
      .completeMultipartUpload({
        Bucket: BUCKET_NAME,
        Key: req.body.params.fileName,
        MultipartUpload: {
          Parts: req.body.params.parts,
        },
        UploadId: req.body.params.uploadId,
      })
      .promise();
    res.send({ message: 'successfully completed upload', payload: data });
  } catch (err) {
    console.log(err);
  }
};
