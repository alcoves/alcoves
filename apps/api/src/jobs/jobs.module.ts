import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { JobsService } from './jobs.service'
import { JobsController } from './jobs.controller'
import { PrismaService } from '../services/prisma.service'
import { IngestProcessor } from './processors/ingest.processor'
import { UtilitiesService } from '../utilities/utilities.service'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'ingest',
    }),
  ],
  exports: [BullModule],
  controllers: [JobsController],
  providers: [JobsService, PrismaService, IngestProcessor, UtilitiesService],
})
export class JobsModule {}
