export interface User {
  id: number
  email: string
  username: string
  isAuthenticated: boolean
}

export interface UserContextProps {
  user: User
  loading: boolean
  logout: () => Promise<void>
  login: ({ email, password }: { email: string; password: string }) => Promise<void>
}

export interface Video {
  progress: number
  data: {
    metadata: any
  }
  id: string
  urls: {
    m3u8Url: string
    thumbnailUrl: string
  }
}
