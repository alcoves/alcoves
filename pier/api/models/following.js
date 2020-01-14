const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followerSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, default: mongoose.Types.ObjectId() },
    followerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    followeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

followerSchema.index({ followerId: 1, followeeId: 1 }, { unique: true });

module.exports = mongoose.model('Follower', followerSchema);
