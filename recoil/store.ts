import { atom } from 'recoil'

import { Upload } from '../types/types'

export const recoilUploads = atom<Upload[]>({
  key: 'uploads',
  default: [],
})