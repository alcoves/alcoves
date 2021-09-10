export interface Video {
  id: string
  title: string
  duration: string
  views: number
  thumbnail: string
  percent_completed: string
  created_at: string
  updated_at: string
  deleted_at?: string
  mpd_link: string
  user_id: string
  visibility: "unlisted" | "public"
  status: "queued" | "processing" | "completed"
}