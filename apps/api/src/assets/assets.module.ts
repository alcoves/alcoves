import { Module } from '@nestjs/common'
import { AssetsService } from './assets.service'
import { JobsService } from '../jobs/jobs.service'
import { AssetsController } from './assets.controller'
import { PrismaService } from '../services/prisma.service'
import { JobsModule } from '../jobs/jobs.module'
import { UtilitiesService } from '../utilities/utilities.service'

@Module({
  imports: [JobsModule],
  controllers: [AssetsController],
  providers: [AssetsService, PrismaService, JobsService, UtilitiesService],
})
export class AssetsModule {}