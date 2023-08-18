import { Module } from '@nestjs/common'
import { Queues } from '../types/types'
import { BullModule } from '@nestjs/bull'
import { VideosService } from './videos.service'
import { VideosController } from './videos.controller'
import { MulterModule } from '@nestjs/platform-express'
import { PrismaService } from '../services/prisma.service'
import { IngestProcessor } from './ingest.processor'

@Module({
  imports: [
    MulterModule.register({
      dest: '/data/uploads',
    }),
    BullModule.registerQueue(
      {
        name: 'ingest',
        defaultJobOptions: {
          attempts: 2,
          backoff: {
            type: 'exponential',
            delay: 1000 * 10,
          },
        },
      },
      {
        name: Queues.transcode,
        defaultJobOptions: {
          attempts: 2,
          backoff: {
            type: 'exponential',
            delay: 1000 * 10,
          },
        },
      },
      {
        name: Queues.thumbnail,
        defaultJobOptions: {
          attempts: 2,
          backoff: {
            type: 'exponential',
            delay: 1000 * 10,
          },
        },
      }
    ),
  ],
  controllers: [VideosController],
  providers: [VideosService, PrismaService, IngestProcessor],
})
export class VideosModule {}
