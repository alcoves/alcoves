import { nanoid } from 'nanoid'
import create from 'zustand'

import { Upload, UploadState } from '../types/types'

export const uploadsStore = create<UploadState>((set: any, get: any) => {
  return {
    uploads: [],
    add: (file: File) => {
      set((state: UploadState) => ({
        uploads: [
          ...state.uploads,
          {
            file,
            id: nanoid(),
          } as Upload,
        ],
      }))
    },
    remove: (id: string) => {
      set((state: UploadState) => ({
        todos: state.uploads.filter(u => u.id !== id),
      }))
    },
    start: async () => {
      // Starts an upload
      // Updates state along the way
    },
  }
})
