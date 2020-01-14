const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followings = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, default: mongoose.Types.ObjectId() },
    followerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    followeeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// followings.index({ followerId: 1, followeeId: 1 }, { unique: true });

module.exports = mongoose.model('Followings', followings);
