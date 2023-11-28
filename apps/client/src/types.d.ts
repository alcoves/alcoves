enum AssetStatus {
  ERROR = 'ERROR',
  READY = 'READY',
  CREATED = 'CREATED',
  INGESTING = 'INGESTING',
  PROCESSING = 'PROCESSING',
}

export interface Asset {
  id: string
  url: string
  updatedAt: string
  createdAt: string
  contentType: string
  status: AssetStatus
}
