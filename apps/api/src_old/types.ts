export enum JOB_QUEUES {
  SCANNER = 'scanner',
  THUMBNAILS = 'thumbnails',
}

export interface ScannerProcessorInputs {
  path: string
}

export interface ThumbnailProcessorInputs {
  videoId: string
}
