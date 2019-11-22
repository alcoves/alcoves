const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const channelSchema = new Schema({
  _id: Schema.Types.ObjectId,
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
});

module.exports = mongoose.model('Channel', channelSchema);
