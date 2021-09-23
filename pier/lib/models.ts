import mongoose from 'mongoose'

export const Pod = mongoose.model("Pod", new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  owner: { type : mongoose.Types.ObjectId, ref: 'User' },
  members: [{ type : mongoose.Types.ObjectId, ref: 'User' }],
}, { timestamps: true }))

export const User = mongoose.model("User", new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  email: String,
  image: String,
}))

export const Video = mongoose.model("Video", new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  title: String,
  tidalAssetId: mongoose.Types.ObjectId,
  pod: { type : mongoose.Types.ObjectId, ref: 'Pod' },
  owner: { type : mongoose.Types.ObjectId, ref: 'User' },
}, { timestamps: true }))