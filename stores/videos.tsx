import axios from 'axios'
import create from 'zustand'

import { Video } from '../types/types'
import { getAPIUrl } from '../utils/urls'

export const useVideos = create<any>((set: any) => ({
  videos: [] as Video[],
  toggleSelected: (id: string) => {
    set((state: any) => ({
      videos: state.videos.map((v: Video) => {
        return v.id === id ? { ...v, selected: !v.selected } : v
      }),
    }))
  },
  getSelectedIds: () => {
    const state = useVideos.getState()
    return state.videos
      .filter((v: Video) => {
        return v.selected ? true : false
      })
      .map((v: Video) => {
        return v.id
      })
  },
  start: () => {
    axios.get(`${getAPIUrl()}/videos?limit=20`).then(({ data }) => {
      const _videos = data?.payload?.map((v: Video) => {
        return {
          ...v,
          selected: false,
        }
      })
      set(() => ({
        videos: _videos,
      }))
    })
  },
  add: (video: Video) => {
    set((state: any) => ({ videos: [{ ...video, selected: false }, ...state.videos] }))
  },
  loadMore: async () => {
    const state = useVideos.getState()
    const lastVideo = state.videos[state.videos.length - 1]
    const cursorQuery = `${lastVideo.id}_${lastVideo.createdAt}`
    const fetchURL = `${getAPIUrl()}/videos?limit=20&after=${cursorQuery}`
    const { data } = await axios.get(fetchURL)

    const _videos = data.payload.map((v: Video) => {
      return {
        ...v,
        selected: false,
      }
    })

    set((state: any) => ({
      videos: [...state.videos, ..._videos],
    }))
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
