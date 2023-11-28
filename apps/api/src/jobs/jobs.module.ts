import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { JobsService } from './jobs.service'
import { JobsController } from './jobs.controller'
import { AssetsService } from '../assets/assets.service'
import { PrismaService } from '../services/prisma.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ImagesProcessor } from './processors/images.processor'
import { IngestProcessor } from './processors/ingest.processor'
import { UtilitiesService } from '../utilities/utilities.service'

@Module({
  imports: [
    BullModule.registerQueueAsync(
      {
        name: 'images',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.get('ALCOVES_REDIS_HOST'),
            port: configService.get('ALCOVES_REDIS_PORT'),
          },
        }),
      },
      {
        name: 'ingest',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.get('ALCOVES_REDIS_HOST'),
            port: configService.get('ALCOVES_REDIS_PORT'),
          },
        }),
      }
    ),
  ],
  exports: [BullModule],
  controllers: [JobsController],
  providers: [
    JobsService,
    PrismaService,
    AssetsService,
    ImagesProcessor,
    IngestProcessor,
    UtilitiesService,
  ],
})
export class JobsModule {}
