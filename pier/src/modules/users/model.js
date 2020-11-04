const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    _id: { auto: true, type: Schema.Types.ObjectId },
    code: { type: String },
    password: { type: String, required: true },
    nickname: { type: String, required: false },
    roles: { type: Array, required: true, default: [] },
    plan: { type: String, required: true, default: 'free' },
    username: { type: String, required: true, lowercase: true },
    emailVerified: { type: Boolean, required: true, default: false },
    avatar: { type: String, required: true, default: 'https://cdn.bken.io/files/favicon.png' },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
  },
  { timestamps: true }
);

userSchema.index({ username: 'text' });

module.exports = mongoose.model('User', userSchema);
