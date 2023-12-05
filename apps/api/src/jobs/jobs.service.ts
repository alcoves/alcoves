import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { CreateJobDto } from './dto/create-job.dto'
import {
  AssetJobs,
  DeleteStorageFolderJobData,
  ThumbnailJobData,
  IngestUrlJobData,
  MaintenanceJobs,
  IngestJobs,
  Queues,
} from './jobs.constants'
import {
  GetThumbnailParamsDto,
  GetThumbnailQueryDto,
} from '../stream/dto/getThumbailDto'

@Injectable()
export class JobsService {
  constructor(
    @InjectQueue(Queues.ASSET) private assetQueue: Queue,
    @InjectQueue(Queues.INGEST) private ingestQueue: Queue,
    @InjectQueue(Queues.MAINTENANCE) private maintenanceQueue: Queue
  ) {}

  getQueues(): string[] {
    return Object.keys(this).filter((key) => key.includes('Queue'))
  }

  create(createJobDto: CreateJobDto) {
    return 'This action adds a new job'
  }

  async cleanQueues() {
    await Promise.all(
      this.getQueues().map(async (queue) => {
        await this[queue].clean(1000, 'completed')
        await this[queue].clean(1000, 'failed')
      })
    )
    return 'done'
  }

  async findAll() {
    const jobs = await Promise.all(
      this.getQueues().map(async (queue) => {
        const jobs = await this[queue].getJobs([
          'active',
          'waiting',
          'completed',
          'paused',
          'delayed',
          'failed',
        ])
        return jobs
      })
    )

    return jobs.flat().sort((a, b) => b.timestamp - a.timestamp)
  }

  // Job Queue Methods
  async ingestAsset(assetId: string) {
    const job = await this.ingestQueue.add(IngestJobs.INGEST_URL, {
      assetId,
    } as IngestUrlJobData)
    return job
  }

  async thumbnailAsset(
    assetId: string,
    query: GetThumbnailQueryDto,
    params: GetThumbnailParamsDto
  ) {
    const job = await this.assetQueue.add(AssetJobs.THUMBNAIL, {
      assetId,
      query,
      params,
    } as ThumbnailJobData)
    return job
  }

  async deleteStorageFolder(storageBucket: string, storageKey: string) {
    const job = await this.maintenanceQueue.add(
      MaintenanceJobs.DELETE_STORAGE_FOLDER,
      {
        storageBucket,
        storageKey,
      } as DeleteStorageFolderJobData
    )
    return job
  }
}
