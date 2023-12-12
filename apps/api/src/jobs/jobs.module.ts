import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { Queues } from './jobs.constants'
import { JobsService } from './jobs.service'
import { JobsController } from './jobs.controller'
import { PrismaService } from '../services/prisma.service'
import { AssetProcessor } from './processors/asset.processor'
import { IngestProcessor } from './processors/ingest.processor'
import { UtilitiesService } from '../utilities/utilities.service'
import { MaintenanceProcessor } from './processors/maintenance.processor'

@Module({
  imports: [
    BullModule.registerQueue({
      name: Queues.ASSET,
      defaultJobOptions: {
        priority: 1,
        attempts: 1,
        removeOnFail: 500,
        removeOnComplete: 500,
      },
    }),
    BullModule.registerQueue({
      name: Queues.INGEST,
      defaultJobOptions: {
        priority: 2,
        attempts: 4,
        removeOnFail: 500,
        removeOnComplete: 500,
      },
    }),
    BullModule.registerQueue({
      name: Queues.MAINTENANCE,
      defaultJobOptions: {
        priority: 1000,
        attempts: 1,
        removeOnFail: 500,
        removeOnComplete: 500,
      },
    }),
  ],
  exports: [BullModule],
  controllers: [JobsController],
  providers: [
    JobsService,
    PrismaService,
    AssetProcessor,
    IngestProcessor,
    UtilitiesService,
    MaintenanceProcessor,
  ],
})
export class JobsModule {}
