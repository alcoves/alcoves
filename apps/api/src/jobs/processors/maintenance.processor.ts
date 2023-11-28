import { Job } from 'bull'
import { Process, Processor } from '@nestjs/bull'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { PrismaService } from '../../services/prisma.service'
import { UtilitiesService } from '../../utilities/utilities.service'
import {
  Queues,
  MaintenanceJobs,
  DeleteStorageFolderJobData,
} from '../jobs.constants'

@Processor(Queues.MAINTENANCE)
export class MaintenanceProcessor {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly prismaService: PrismaService,
    private readonly utilitiesService: UtilitiesService
  ) {}

  @Process({
    concurrency: 4,
    name: MaintenanceJobs.DELETE_STORAGE_FOLDER,
  })
  async process(job: Job<DeleteStorageFolderJobData>) {
    const { storageBucket, storageKey } = job.data
    await this.utilitiesService.deleteStorageFolder(storageBucket, storageKey)
    await job.progress(100)
    return 'done'
  }
}
