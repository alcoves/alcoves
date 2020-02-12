const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followings = new Schema(
  {
    _id: {
      auto: true,
      type: Schema.Types.ObjectId,
    },
    follower: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    followee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

followings.index({ follower: 1, followee: 1 }, { unique: false });

module.exports = mongoose.model('Followings', followings);
