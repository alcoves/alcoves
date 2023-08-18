import { Module } from '@nestjs/common'
import { Queues } from '../types/types'
import { BullModule } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config'
import { IngestProcessor } from './ingest.processor'
import { VideosService } from '../videos/videos.service'
import { PrismaService } from '../../src/services/prisma.service'

const BullQueues = BullModule.registerQueue(
  {
    name: Queues.ingest.name,
    defaultJobOptions: {
      priority: 200,
      removeOnComplete: false,
      attempts: 2,
      backoff: {
        type: 'exponential',
        delay: 1000 * 10,
      },
    },
  },
  {
    name: Queues.transcode.name,
    defaultJobOptions: {
      priority: 300,
      removeOnComplete: false,
      attempts: 2,
      backoff: {
        type: 'exponential',
        delay: 1000 * 10,
      },
    },
  },
  {
    name: Queues.thumbnail.name,
    defaultJobOptions: {
      priority: 100,
      removeOnComplete: false,
      attempts: 2,
      backoff: {
        type: 'exponential',
        delay: 1000 * 10,
      },
    },
  }
)

@Module({
  imports: [BullQueues],
  exports: [BullQueues],
  providers: [ConfigService, PrismaService, VideosService, IngestProcessor],
})
export class ProcessorsModule {}
