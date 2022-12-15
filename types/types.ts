export interface Video {
  id: string
  name: string
  delay: number
  progress: number
  stacktrace: any[]
  attemptsMade: number
  data: VideoData
  opts: VideoOpts
  timestamp: number
  finishedOn: number
  processedOn: number
  urls: VideoReturn
  returnvalue?: any
}

interface VideoData {
  url: string
  metadata?: any
}

interface VideoOpts {
  attempts: number
  delay: number
  jobId: string
  backoff: any
}

interface VideoReturn {
  m3u8Url: string
  dashUrl: string
  thumbnailUrl: string
}

export interface UploadResponse {
  id: string
  url: string
}

export interface CreateVideoResponse extends Video {}
