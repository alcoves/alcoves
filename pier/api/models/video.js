const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;

const mediaSchema = new Schema({
  source: { type: String, required: true },
  '720p': { type: String, required: false },
  '1080p': { type: String, required: false },
  '1440p': { type: String, required: false },
  '2160p': { type: String, required: false },
});

const videoSchema = new Schema(
  {
    title: { type: String, required: true },
    status: { type: String, required: true },
    media: { type: mediaSchema, required: true },
    sourceFileName: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    _id: {
      type: String,
      default: shortid.generate,
    },
    thumbnail: {
      type: String,
      default:
        'https://s3.us-east-2.wasabisys.com/media-bken/files/default-thumbnail-sm.jpg',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Video', videoSchema);
