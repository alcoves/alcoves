const mime = require('mime');
const { nanoid } = require('nanoid');
const { GraphQLUpload } = require('graphql-upload');
const ds3 = require('../../utils/ds3');
const Video = require('../videos/model');
const dispatchJob = require('../../utils/dispatchJob');
const { DIGITAL_OCEAN_TIDAL_BUCKET } = require('../../utils/config');

const resolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    async createUpload(_, { input }, { authenticate }) {
      authenticate();

      const id = nanoid();
      const url = ds3.getSignedUrl('putObject', {
        Expires: 3600,
        Bucket: DIGITAL_OCEAN_TIDAL_BUCKET,
        Key: `${id}/source.${mime.getExtension(input.fileType)}`,
      });
      return { id, url };
    },
    async completeUpload(_, { input: { id, title, duration, fileType } }, { user, authenticate }) {
      authenticate();

      const video = await new Video({
        title,
        _id: id,
        views: 0,
        duration,
        user: user.id,
      }).save();
    
      // await dispatchJob('uploading', {
      //   s3_in: `s3://${DIGITAL_OCEAN_TIDAL_BUCKET}/${id}/source.${mime.getExtension(fileType)}`,
      // });

      await dispatchJob('converting', {
        s3_in: `s3://${DIGITAL_OCEAN_TIDAL_BUCKET}/${id}/source.${mime.getExtension(fileType)}`,
      });
    
      await dispatchJob('thumbnail', {
        s3_out: `s3://cdn.bken.io/i/${id}/t/thumb.webp`,
        cmd: '-vf scale=854:480:force_original_aspect_ratio=increase,crop=854:480 -vframes 1 -q:v 50',
        s3_in: `s3://${DIGITAL_OCEAN_TIDAL_BUCKET}/${id}/source.${mime.getExtension(fileType)}`,
      });
    
      return video;
    },
  },
};

module.exports = resolvers;
