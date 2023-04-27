export interface Video {
  id: string
  size: number
  title: string
  location: string
  authoredAt: string
  tags: Tag[]
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
