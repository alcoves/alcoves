import { Metadata } from "./getMetadata"
import mongoose from "mongoose"
import { getX264Args} from './ffCommands'

export interface Preset {
  name: string
  width: number,
  height: number,
  defaultMaxRate: number
}

export function clampPreset (w: number, h: number, dw: number, dh: number): boolean {
  if ((w >= dw && h >= dh) || (w >= dh && h >= dw)) {
    return true
  }
  return false
}

export function getS3CpCommand(id: string) {
  return `aws s3 cp ./ s3://cdn.bken.io/v/${id}/progressive/ --recursive --profile wasabi --endpoint https://us-east-2.wasabisys.com`
}

export function getTranscodingJobs(m: Metadata, videoId: string, url: string) {
  const w = m.video.width || 0
  const h = m.video.height || 0

  const presets: unknown[] = [{
    _id: new mongoose.Types.ObjectId(),
    video: new mongoose.Types.ObjectId(videoId),
    type: 'transcode',
    status: 'queued',
    name: "transcode_360",
    ffmpegCommand: getX264Args(m, 480, 360, url),
  }]

  if (clampPreset(w, h, 1280, 720)) {
    presets.push({
      _id: new mongoose.Types.ObjectId(),
      video: new mongoose.Types.ObjectId(videoId),
      type: 'transcode',
      status: 'queued',
      name: "transcode_720",
      ffmpegCommand: getX264Args(m, 1280, 720, url),
    })
  
  }

  if (clampPreset(w, h, 1920, 1080)) {
    presets.push({
      _id: new mongoose.Types.ObjectId(),
      video: new mongoose.Types.ObjectId(videoId),
      type: 'transcode',
      status: 'queued',
      name: "transcode_1080",
      ffmpegCommand: getX264Args(m, 1920, 1080, url),
    })
  }

  if (clampPreset(w, h, 2560, 1440)) {
    presets.push({
      _id: new mongoose.Types.ObjectId(),
      video: new mongoose.Types.ObjectId(videoId),
      type: 'transcode',
      status: 'queued',
      name: "transcode_1440",
      ffmpegCommand: getX264Args(m, 2560, 1440, url),
    })
  }

  if (clampPreset(w, h, 3840, 2160)) {
    presets.push({
      _id: new mongoose.Types.ObjectId(),
      video: new mongoose.Types.ObjectId(videoId),
      type: 'transcode',
      status: 'queued',
      name: "transcode_2160",
      ffmpegCommand: getX264Args(m, 3840, 2160, url),
    })
  }

  return presets
}

export function getThumbnailJobs(m: Metadata, videoId: string, url: string) {
  const ffThumbCmds = [
    "-y",
    "-i", url,
    "-vf", "scale=854:480:force_original_aspect_ratio=increase,crop=854:480",
    "-vframes", "1",
    "-q:v", "6",
    "-f", "image2",
    "./thumb.jpg"
  ]
  const jobs: unknown[] = [{
    _id: new mongoose.Types.ObjectId(),
    video: new mongoose.Types.ObjectId(videoId),
    type: 'thumbnail',
    status: 'queued',
    name: "thumbnail_jpg",
    ffmpegCommand: ffThumbCmds.join(" ")
  }]
  return jobs
}

export function getPackagingJobs(videoId: string) {
  const jobs: unknown[] = [{
    _id: new mongoose.Types.ObjectId(),
    video: new mongoose.Types.ObjectId(videoId),
    type: 'package',
    status: 'queued',
    name: "package_hls",
  }]
  return jobs
}