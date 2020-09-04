const { nanoid } = require('nanoid');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const defaultThumbnail = 'https://cdn.bken.io/files/default-thumbnail-sm.jpg';

const version = new Schema(
  {
    link: { type: String },
    preset: { type: String, required: true },
    status: { type: String, default: 'queueing', required: true },
    percentCompleted: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);

const videoSchema = new Schema(
  {
    versions: [version],
    _id: { type: String, default: nanoid },
    duration: { type: Number, required: true },
    views: { type: Number, default: 0, required: true },
    title: { type: String, required: true, default: nanoid },
    status: { type: String, required: true, default: 'uploading' },
    thumbnail: { type: String, default: defaultThumbnail, required: true },
    user: {
      ref: 'User',
      index: true,
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

videoSchema.index({ title: 'text' });

module.exports = mongoose.model('Video', videoSchema);
