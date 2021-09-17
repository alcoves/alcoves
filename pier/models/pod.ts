import mongoose from 'mongoose'

export default mongoose.model("Pod", new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  owner: { type : mongoose.Types.ObjectId, ref: 'User' },
  members: [{ type : mongoose.Types.ObjectId, ref: 'User' }],
}, { timestamps: true }))