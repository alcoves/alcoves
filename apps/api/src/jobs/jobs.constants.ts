import {
  GetThumbnailParamsDto,
  GetThumbnailQueryDto,
} from '../stream/dto/getThumbailDto'

export enum Queues {
  ASSET = 'asset',
  INGEST = 'ingest',
  MAINTENANCE = 'maintenance',
}

export enum IngestJobs {
  INGEST_URL = 'INGEST_URL',
}

export enum AssetJobs {
  THUMBNAIL = 'THUMBNAIL',
}

export enum MaintenanceJobs {
  DELETE_STORAGE_FOLDER = 'DELETE_STORAGE_FOLDER',
}

export interface IngestUrlJobData {
  assetId: string
}

export interface ThumbnailJobData {
  assetId: string
  params: GetThumbnailParamsDto
  query: GetThumbnailQueryDto
}

export interface DeleteStorageFolderJobData {
  storageKey: string
  storageBucket: string
}
