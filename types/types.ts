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
  logout: () => void
  login: (token: string) => void
}

export interface UploadsState {
  uploads: Upload[]
  addUpload: (file: File) => Promise<void>
}

export interface Upload {
  file: File
  status: string
  completed: number
  uploadUrls: string[]
}

export interface Video {
  id: string
  user: User
  title: string
  status: string
  length: number
  progress: number
  libraryId: string
  thumbnailFilename: string
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
