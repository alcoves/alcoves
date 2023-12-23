import { Module } from '@nestjs/common'
import { JobsModule } from '../jobs/jobs.module'
import { AssetsService } from './assets.service'
import { JobsService } from '../jobs/jobs.service'
import { AssetsController } from './assets.controller'
import { PrismaService } from '../services/prisma.service'
import { UtilitiesService } from '../utilities/utilities.service'

@Module({
  imports: [JobsModule],
  controllers: [AssetsController],
  providers: [JobsService, AssetsService, PrismaService, UtilitiesService],
})
export class AssetsModule {}
