import { nanoid } from 'nanoid'
import create from 'zustand'

import { Upload, UploadState } from '../types/types'

export const uploadsStore = create<UploadState>((set: any) => {
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
    remove: (index: number) => {
      set((state: UploadState) => {
        const newArray = state.uploads
        newArray.splice(index, 1)
        return { uploads: newArray }
      })
    },
  }
})
