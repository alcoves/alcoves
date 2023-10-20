import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { JobsService } from './jobs.service'
import { JobsController } from './jobs.controller'
import { ImagesConsumer } from './consumers/images.consumer'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'images',
    }),
  ],
  controllers: [JobsController],
  providers: [JobsService, ImagesConsumer],
})
export class JobsModule {}
