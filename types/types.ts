import * as fs from 'fs'

enum AssetType {
  file = 'file',
  folder = 'folder',
}

export interface Asset {
  fullPath: string
  name: string
  stats: fs.Stats
  type: AssetType
  streamPath: string | null
}
