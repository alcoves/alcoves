import { Job } from 'bull'
import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { PrismaService } from '../../services/prisma.service'
import {
  OnQueueCompleted,
  OnQueueProgress,
  Process,
  Processor,
} from '@nestjs/bull'

@Processor('ingest')
export class IngestProcessor {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {}

  @OnQueueProgress()
  async onProgress(job: Job) {
    const progress = await job.progress()
    this.eventEmitter.emit('job-update', { id: job.id, progress })
  }

  @OnQueueCompleted()
  onCompleted() {
    this.eventEmitter.emit('job-update', { data: 'completed' })
  }

  @Process({
    concurrency: 1,
    name: 'ingest_asset',
  })
  async process(job: Job<any>) {
    console.log('ingesting asset', job.data)
    const asset = await this.prismaService.asset.findFirst({
      where: { id: job.data.assetId },
    })
    console.log('asset', asset)

    for (let i = 0; i < 100; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      console.log(i)
      await job.progress(i)
    }

    await job.progress(100)
    return 'done'
  }
}
