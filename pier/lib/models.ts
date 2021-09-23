import { Types, Schema, model } from 'mongoose'

export const Pod = model("Pod", new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  owner: { type : Schema.Types.ObjectId, ref: 'User' },
  members: [{ type : Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true }))

export const User = model("User", new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  email: String,
  image: String,
}))

export const Video = model("Video", new Schema({
  _id: Schema.Types.ObjectId,
  title: String,
  tidal: Schema.Types.ObjectId,
  pod: { type : Schema.Types.ObjectId, ref: 'Pod' },
  owner: { type : Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true }))