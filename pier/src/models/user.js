// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const avatarDefault =
//   'https://s3.us-east-2.wasabisys.com/media-bken/files/avatar.jpg';

// const userSchema = new Schema(
//   {
//     _id: {
//       auto: true,
//       type: Schema.Types.ObjectId,
//     },
//     password: { type: String, required: true },
//     displayName: { type: String, required: true },
//     followers: { type: Number, required: true, default: 0 },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
//     },
//     avatar: { type: String, required: true, default: avatarDefault },
//   },
//   { timestamps: true }
// );

// userSchema.index({ displayName: 'text' });

// module.exports = mongoose.model('User', userSchema);
