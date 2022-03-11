import create from 'zustand'

import { Video } from '../types/types'

export const useVideos = create<any>((set: any) => ({
  videos: [],
  add: (video: Video) => {
    set((state: any) => ({ videos: [video, ...state.videos] }))
  },
  set: (videos: Video[]) => {
    set(() => ({ videos }))
  },
  loadMore: (videos: Video[]) => {
    set((state: any) => ({ videos: [...state.videos, ...videos] }))
  },
  remove: (id: string) => {
    set((state: any) => ({
      videos: state.videos.filter((v: Video) => v.id !== id),
    }))
  },
  update: (updatedVideo: Video) => {
    set((state: any) => ({
      videos: state.videos.map((v: Video) => {
        return v.id === updatedVideo.id ? updatedVideo : v
      }),
    }))
  },
}))
