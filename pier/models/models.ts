import{ Schema, model, Types, PopulatedDoc  } from "mongoose"

export interface PodInterface {
  _id: Types.ObjectId,
  name: string,
  owner: PopulatedDoc<UserInterface & Document>,
  members: PopulatedDoc<UserInterface & Document>[]
}

export interface UserInterface {
  _id: Types.ObjectId,
  name: string,
  email: string,
  image: string,
}

export interface VideoInterface {
  _id: Types.ObjectId,
  title: String,
  tidal: Types.ObjectId,
  pod: PopulatedDoc<PodInterface & Document>,
  owner: PopulatedDoc<UserInterface & Document>,
}

const podSchema = new Schema<PodInterface>({
  _id: Schema.Types.ObjectId,
  name: String,
  owner: { type : Schema.Types.ObjectId, ref: 'User' },
  members: [{ type : Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true })

const userSchema = new Schema<UserInterface>({
  _id: Schema.Types.ObjectId,
  name: String,
  email: String,
  image: String,
}, { timestamps: true })

const videoSchema = new Schema<VideoInterface>({
  _id: Schema.Types.ObjectId,
  title: String,
  tidal: Schema.Types.ObjectId,
  pod: { type : Schema.Types.ObjectId, ref: 'Pod' },
  owner: { type : Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

export const Pod = model<PodInterface>("Pod", podSchema)
export const User = model<UserInterface>("User", userSchema)
export const Video = model<VideoInterface>("Video", videoSchema)
