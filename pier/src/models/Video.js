const { nanoid } = require('nanoid');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const videoSchema = new Schema(
  {
    _id: { type: String, default: nanoid },
    duration: { type: Number, required: true },
    views: { type: Number, default: 0, required: true },
    title: { type: String, required: true, default: nanoid },
    visibility: { type: String, required: true, default: 'private' },
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
