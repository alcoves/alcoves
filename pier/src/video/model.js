const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;

const defaultThumbnail =
  'https://s3.us-east-2.wasabisys.com/media-bken/files/default-thumbnail-sm.jpg';

const fileSchema = new Schema({
  link: { type: String },
  startedAt: { type: Date },
  completedAt: { type: Date },
  status: { type: String, required: true },
  percentCompleted: { type: Number, default: 0, required: true },
});

const videoSchema = new Schema(
  {
    title: { type: String, required: true, default: shortid.generate },
    status: { type: String, required: true, default: 'uploading' },
    sourceFile: { type: String, required: false },
    _id: { type: String, default: shortid.generate },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    thumbnail: { type: String, default: defaultThumbnail, required: true },
    views: { type: Number, default: 0, required: true },
    files: {
      '480p': { type: fileSchema },
      '720p': { type: fileSchema },
      '1080p': { type: fileSchema },
      '1440p': { type: fileSchema },
      '2160p': { type: fileSchema },
      highQuality: { type: fileSchema },
    },
  },
  { timestamps: true }
);

videoSchema.index({ title: 'text' });

module.exports = mongoose.model('Video', videoSchema);
