const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: { type: String, required: true },
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel',
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Channel',
    required: true,
  },
});

module.exports = mongoose.model('Video', videoSchema);
