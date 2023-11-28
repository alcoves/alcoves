import { Module } from '@nestjs/common'
import { JobsModule } from '../jobs/jobs.module'
import { StreamService } from './stream.service'
import { JobsService } from '../jobs/jobs.service'
import { StreamController } from './stream.controller'
import { AssetsService } from '../assets/assets.service'
import { PrismaService } from '../services/prisma.service'
import { UtilitiesService } from '../utilities/utilities.service'

@Module({
  imports: [JobsModule],
  controllers: [StreamController],
  providers: [
    StreamService,
    PrismaService,
    AssetsService,
    JobsService,
    UtilitiesService,
  ],
})
export class StreamModule {}
