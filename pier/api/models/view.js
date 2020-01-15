const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const viewSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    video: { type: String, ref: 'Video', required: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('View', viewSchema);
