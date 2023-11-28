import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { Queues } from './jobs.constants'
import { JobsService } from './jobs.service'
import { JobsController } from './jobs.controller'
import { PrismaService } from '../services/prisma.service'
import { IngestProcessor } from './processors/ingest.processor'
import { UtilitiesService } from '../utilities/utilities.service'
import { MaintenanceProcessor } from './processors/maintenance.processor'

@Module({
  imports: [
    BullModule.registerQueue({
      name: Queues.INGEST,
    }),
    BullModule.registerQueue({
      name: Queues.MAINTENANCE,
    }),
  ],
  exports: [BullModule],
  controllers: [JobsController],
  providers: [
    JobsService,
    PrismaService,
    IngestProcessor,
    UtilitiesService,
    MaintenanceProcessor,
  ],
})
export class JobsModule {}
