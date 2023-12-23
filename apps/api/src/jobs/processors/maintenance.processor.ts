import { Job } from 'bull'
import { Logger } from '@nestjs/common'
import { Process, Processor } from '@nestjs/bull'
import { StreamService } from '../../stream/stream.service'
import { PrismaService } from '../../services/prisma.service'
import { UtilitiesService } from '../../utilities/utilities.service'
import {
  Queues,
  MaintenanceJobs,
  DeleteStorageFolderJobData,
} from '../jobs.constants'

@Processor(Queues.MAINTENANCE)
export class MaintenanceProcessor {
  private readonly logger = new Logger(MaintenanceProcessor.name)

  constructor(
    private readonly prismaService: PrismaService,
    private readonly utilitiesService: UtilitiesService
  ) {}

  @Process({
    concurrency: 4,
    name: MaintenanceJobs.DELETE_STORAGE_FOLDER,
  })
  async process(job: Job<DeleteStorageFolderJobData>) {
    const { storageBucket, storageKey } = job.data
    this.logger.log({ storageBucket, storageKey })
    await this.utilitiesService.deleteStorageFolder(storageBucket, storageKey)
    await job.progress(100)
    return 'done'
  }
}
