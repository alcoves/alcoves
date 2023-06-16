import { JOB_QUEUES } from '../types'
import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { VideosService } from './videos.service'
import { VideosController } from './videos.controller'
import { PrismaService } from '../services/prisma.service'

@Module({
  controllers: [VideosController],
  providers: [VideosService, PrismaService],
  imports: [
    BullModule.registerQueue(
      {
        name: JOB_QUEUES.SCANNER,
        defaultJobOptions: {
          attempts: 10,
          backoff: {
            type: 'exponential',
            delay: 1000 * 10,
          },
        },
      },
      {
        name: JOB_QUEUES.THUMBNAILS,
        defaultJobOptions: {
          attempts: 10,
          backoff: {
            type: 'exponential',
            delay: 1000 * 10,
          },
        },
      }
    ),
  ],
})
export class VideosModule {}
