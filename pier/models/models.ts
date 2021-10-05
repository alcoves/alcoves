import moment from 'moment'
import {getAsset } from '../lib/tidal'
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

videoSchema.post('find', async function(result) {
  try {
    for (const video of result) {
      const updatedAt = moment(video.updatedAt).utc()
      const currentTime = moment().utc()
      const isStale = currentTime.diff(updatedAt, 'hours') > 12

      if (isStale || video.status !== 'completed') {
        // console.log("Hydrating video with fresh tidal waves", { _id: video._id, status: video.status, isStale })
        const tidalVideo = await getAsset(video.tidal)
        video.views = tidalVideo.views
        video.duration = tidalVideo.duration
        video.updatedAt = moment().utc() // Important to update this here because mongo will noop if data doesn't change
        const completedRenditions = tidalVideo?.renditions.filter((r: { status: string }) => r.status === 'completed')
        const erroredRenditions = tidalVideo?.renditions.filter((r: { status: string }) => r.status === 'errored')
        if (erroredRenditions.length) {
          video.status = 'errored'
        } else if (completedRenditions.length) {
          video.status = 'completed'
        } else {
          video.status = 'processing'
        }
        await video.save()
      }
    }
  } catch(error) {
    console.error("There was an error hydrating videos from tidal")
    console.error(error)
  }
});

export const Pod = model<PodInterface>("Pod", podSchema)
export const User = model<UserInterface>("User", userSchema)
export const Video = model<VideoInterface>("Video", videoSchema)
