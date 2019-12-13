const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: { type: String, required: true },
});

module.exports = mongoose.model('Video', videoSchema);
