export enum Queues {
  INGEST = 'ingest',
  MAINTENANCE = 'maintenance',
}

export enum AssetJobs {
  INGEST_URL = 'INGEST_URL',
}

export interface IngestUrlJobData {
  assetId: string
}

export enum MaintenanceJobs {
  DELETE_STORAGE_FOLDER = 'DELETE_STORAGE_FOLDER',
}

export interface DeleteStorageFolderJobData {
  storageKey: string
  storageBucket: string
}
