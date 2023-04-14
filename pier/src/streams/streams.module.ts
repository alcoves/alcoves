import { Module } from '@nestjs/common'
import { StreamsService } from './streams.service'
import { StreamsController } from './streams.controller'

@Module({
  controllers: [StreamsController],
  providers: [StreamsService],
})
export class StreamsModule {}
