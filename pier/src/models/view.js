const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const viewSchema = new Schema(
  {
    views: { type: Number, default: 1, required: true },
    video: { type: String, ref: 'Video', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    _id: {
      auto: true,
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

viewSchema.index({ user: 1, video: 1 }, { unique: true });

module.exports = mongoose.model('View', viewSchema);
