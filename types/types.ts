export interface User {
  id: string
  iat: number
  exp: number
  email: string
  image: string
  username: string
}

export interface UserState {
  user?: User | null
  loading?: boolean
  logout?: () => void
  authenticated?: boolean
  login?: (token: string) => void
}
