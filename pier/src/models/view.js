const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const viewSchema = new Schema(
  {
    views: { type: Number, default: 1, required: true },
    video: { type: String, ref: 'Video', required: true, index: true },
    _id: { type: Schema.Types.ObjectId, default: mongoose.Types.ObjectId() },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('View', viewSchema);
