const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const viewSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    videoId: { type: String, ref: 'Video', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('View', viewSchema);
