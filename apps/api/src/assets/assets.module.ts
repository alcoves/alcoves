import { Module } from '@nestjs/common'
import { AssetsService } from './assets.service'
import { AssetsController } from './assets.controller'

@Module({
  providers: [AssetsService],
  controllers: [AssetsController],
})
export class AssetsModule {}
