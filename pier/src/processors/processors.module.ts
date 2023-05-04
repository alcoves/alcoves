import { JOB_QUEUES } from '../types'
import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { ScannerProcessor } from './scanner.processor'
import { PrismaService } from '../services/prisma.service'
import { ThumbnailProcessor } from './thumbnail.processor'

@Module({
  providers: [ThumbnailProcessor, ScannerProcessor, PrismaService],
  imports: [
    BullModule.registerQueue({
      name: JOB_QUEUES.THUMBNAILS,
      defaultJobOptions: {
        attempts: 10,
        backoff: {
          type: 'exponential',
          delay: 1000 * 10,
        },
      },
    }),
  ],
})
export class ProcessorsModule {}
