import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { JobsService } from './jobs.service'
import { JobsController } from './jobs.controller'
import { PrismaService } from '../services/prisma.service'
import { ImagesConsumer } from './consumers/images.consumer'
import { IngestConsumer } from './consumers/ingest.consumer'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'images',
    }),
    BullModule.registerQueue({
      name: 'ingest',
    }),
  ],
  controllers: [JobsController],
  providers: [JobsService, PrismaService, ImagesConsumer, IngestConsumer],
})
export class JobsModule {}
