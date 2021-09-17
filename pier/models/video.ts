import mongoose from 'mongoose'

export default mongoose.model("Video", new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  status: String,
  title: String,
  duration: Number,
  views: Number,
  pod: { type : mongoose.Types.ObjectId, ref: 'Pod' },
  owner: { type : mongoose.Types.ObjectId, ref: 'User' },
}, { timestamps: true }))