import moment from 'moment'
import { hydrationQueue, hydrateVideo } from '../lib/tidal'
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
  title: string,
  views: number,
  status: string,
  duration: string,
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
  status: String,
  tidal: Schema.Types.ObjectId,
  views: { type: Number, default: 0 },
  duration: { type: String, default: '' },
  pod: { type : Schema.Types.ObjectId, ref: 'Pod' },
  owner: { type : Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

videoSchema.post('find', async function(result: any) {
  for (const video of result) {
    const updatedAt = moment(video.updatedAt).utc()
    const isStale = moment().utc().diff(updatedAt, 'hours') > 12

    // Videos that are processing are hydrated in the request cycle
    // Stale videos are pushed to a queue to minimize request times
    if (video.status !== 'completed') {
      await hydrateVideo(video)
    } else if (isStale) {
      hydrationQueue.push(video);
    }
  }
});

export const Pod = model<PodInterface>("Pod", podSchema)
export const User = model<UserInterface>("User", userSchema)
export const Video = model<VideoInterface>("Video", videoSchema)
