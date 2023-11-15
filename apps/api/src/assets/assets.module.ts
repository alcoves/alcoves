import { Module } from '@nestjs/common'
import { JobsModule } from '../jobs/jobs.module'
import { AssetsService } from './assets.service'
import { JobsService } from '../jobs/jobs.service'
import { AssetsController } from './assets.controller'
import { PrismaService } from '../services/prisma.service'

@Module({
  imports: [JobsModule],
  controllers: [AssetsController],
  providers: [AssetsService, PrismaService, JobsService],
})
export class AssetsModule {}
