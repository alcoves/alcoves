const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const avatarSchema = new Schema({
  link: { type: String },
});

const userSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    password: { type: String, required: true },
    displayName: { type: String, required: true },
    followers: { type: Number, required: true, default: 0 },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    avatars: {
      original: { type: avatarSchema },
      sm: { type: avatarSchema },
      lg: { type: avatarSchema },
    },
  },
  { timestamps: true }
);

userSchema.index({ displayName: 'text' });

module.exports = mongoose.model('User', userSchema);
