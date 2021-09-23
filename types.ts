export interface User {
  _id: string
  name: string
  email: string
  image: string
}

export interface Pod {
  _id: string
  name: string
}

interface Links {
  thumbnail: string
  original: string
}

export interface Video {
  _id: string
  title: string
  views: number
  pod: string
  status: string
  createdAt: Date
  updatedAt: Date
  duration: number
  owner: User
  links: Links
}
