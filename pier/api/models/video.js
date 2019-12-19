const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: { type: String, required: true },
  status: { type: String, required: false },
  sourceUrl: { type: String, required: false },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Video', videoSchema);
