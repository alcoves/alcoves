enum AssetStatus {
  ERROR = 'ERROR',
  READY = 'READY',
  CREATED = 'CREATED',
  INGESTING = 'INGESTING',
  PROCESSING = 'PROCESSING',
}

export interface Asset {
  id: string
  updatedAt: string
  createdAt: string
  contentType: string
  duration: number
  version: string
  status: AssetStatus
}
