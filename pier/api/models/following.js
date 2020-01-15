const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followings = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, default: mongoose.Types.ObjectId() },
    follower: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    followee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Followings', followings);
