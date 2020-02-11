const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;

const defaultThumbnail =
  'https://s3.us-east-2.wasabisys.com/media-bken/files/default-thumbnail-sm.jpg';

const videoFile = new Schema(
  {
    link: { type: String },
    preset: { type: String, required: true, unique: true },
    status: { type: String, default: 'queueing', required: true },
    percentCompleted: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);

const videoSchema = new Schema(
  {
    files: [videoFile],
    duration: { type: Number, required: true },
    sourceFile: { type: String, required: false },
    _id: { type: String, default: shortid.generate },
    views: { type: Number, default: 0, required: true },
    status: { type: String, required: true, default: 'uploading' },
    title: { type: String, required: true, default: shortid.generate },
    thumbnail: { type: String, default: defaultThumbnail, required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

videoSchema.index({ title: 'text' });

module.exports = mongoose.model('Video', videoSchema);
