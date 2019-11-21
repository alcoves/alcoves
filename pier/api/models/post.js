const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true,
  },
  title: { type: String, required: true },
  authorName: { type: String, required: true },
});

module.exports = mongoose.model('Post', postSchema);
