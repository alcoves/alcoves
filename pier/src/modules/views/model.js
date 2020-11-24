const mongoose = require('mongoose');

const { Schema } = mongoose;

const viewSchema = new Schema(
  {
    _id: { auto: true, type: Schema.Types.ObjectId },
    ip: { type: String, required: true, index: true },
    user: {
      ref: 'User',
      index: true,
      required: false,
      type: Schema.Types.ObjectId,
    },
    video: {
      index: true,
      ref: 'Video',
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('View', viewSchema);
