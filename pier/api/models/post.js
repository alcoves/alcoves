const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  _id: Schema.Types.ObjectId,
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel',
    required: true,
  },
  title: { type: String, required: true },
  authorName: { type: String, required: true },
});

module.exports = mongoose.model('Post', postSchema);
