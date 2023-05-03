export interface Video {
  id: string
  size: number
  title: string
  location: string
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
  hash: string
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
