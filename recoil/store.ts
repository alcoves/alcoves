import { atom } from 'recoil'

import { Upload } from '../types/types'

export const recoilUploads = atom({
  key: 'uploads',
  default: [] as Upload[],
})
