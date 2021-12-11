export interface User {
  _id: string
  name: string
  email: string
  image: string
}

export interface Pod {
  _id: string
  name: string
  owner: string
  members: string[] & User[]
}

export interface Video {
  _id: string
  title: string
  views: number
  status: string
  duration: string
  tidal: string
  pod: string & Pod
  owner: string & User
  createdAt: Date
  updatedAt: Date
}
