import async from 'async'
import moment from 'moment'
import { Types } from 'mongoose'
import axios, { AxiosRequestConfig } from 'axios'

const tidalOptions: AxiosRequestConfig = {
  headers: {
    'X-API-Key': process.env?.TIDAL_API_KEY || ''
  }
}

function getTidalUrl() {
  return process.env.TIDAL_API_URL
}

export async function getAsset(id: Types.ObjectId) {
  const { data }: any = await axios.get(`${getTidalUrl()}/assets/${id}`, tidalOptions)
  return data.data
}

export async function createAsset(input: string) {
  const { data }: any = await axios.post(`${getTidalUrl()}/assets`, {
    input,
  }, tidalOptions)
  return data.data
}

export async function deleteAsset(assetId: string) {
  const deleteUrl = `${getTidalUrl()}/assets/${assetId.toString()}`
  await axios.delete(deleteUrl, tidalOptions)
}

export async function hydrateVideo(video: any) {
  console.log("Hydrating video with fresh tidal waves", { _id: video._id, status: video.status })
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

export const hydrationQueue = async.queue((video: any, callback) => {
  hydrateVideo(video).then(() => callback()).catch((error) => {
    console.error("Error hydrating", error)
  })
}, 4);

// assign a callback
hydrationQueue.drain(() => {
  console.log('all items have been processed');
});

// assign an error callback
hydrationQueue.error((err, task) => {
  console.error('task experienced an error');
});