export interface User {
  _id: string
  email: string
  image: string
}
export interface Video {
  _id: string
  views: number
  duration: number
  owner: User
}
