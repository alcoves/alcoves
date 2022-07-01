export interface User {
  id: string
  iat: number
  exp: number
  email: string
  image: string
  username: string
}

export interface UserState {
  user: User | null
  loading: boolean
  authenticated: boolean
  logout: (url?: string) => void
  login: (token?: string) => void
}

export interface UploadState {
  uploads: Upload[]
  add: (file: File) => void
  remove: (index: number) => void
}

export interface Upload {
  file: File
  id: string
}

export interface Video {
  id: string
  user: User
  size: string
  cdnUrl: string
  width: number
  height: number
  title: string
  status: string
  length: number
  progress: number
  createdAt: string
  updatedAt: string
  thumbnailUrl: string
}

export interface User {
  image: string
  username: string
}

export interface Pod {
  id: string
  name: string
  image: string
  updatedAt: string
  createdAt: string
}
