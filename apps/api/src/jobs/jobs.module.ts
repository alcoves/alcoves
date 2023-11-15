import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { JobsService } from './jobs.service'
import { JobsController } from './jobs.controller'
import { PrismaService } from '../services/prisma.service'
import { ImagesProcessor } from './processors/images.processor'
import { IngestProcessor } from './processors/ingest.processor'
import { ConfigModule, ConfigService } from '@nestjs/config'

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
  providers: [JobsService, PrismaService, ImagesProcessor, IngestProcessor],
})
export class JobsModule {}
