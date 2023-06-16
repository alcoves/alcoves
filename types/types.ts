export interface Video {
  id: string
  title: string
  authoredAt: string
  tags: Tag[]
  playbacks: Playback[]
  thumbnails: Thumbnail[]
  updatedAt: string
  createdAt: string
}

export interface Playback {
  id: string
  size: number
  location: string
  duration: number
  videoId: string
  updatedAt: string
  createdAt: string
}

export interface Thumbnail {
  id: string
  location: string
  videoId: string
  updatedAt: string
  createdAt: string
}

export interface Tag {
  id: string
  name: string
  videos: Video[]
  updatedAt: string
  createdAt: string
}

export interface Job {
  name: string
  data: {
    type: string
    command: string
    input: string
    output: string
    segmentation_options: {
      segment_time: string
    }
  }
  opts: {
    attempts: number
    delay: number
    backoff: {
      delay: number
      type: string
    }
  }
  id: string
  progress: number
  returnvalue: null
  stacktrace: []
  attemptsMade: number
  delay: number
  timestamp: number
  finishedOn?: number
  processedOn?: number
  failedReason?: string
  parentKey?: string
  parent?: {
    id: string
    queueKey: string
  }
}
