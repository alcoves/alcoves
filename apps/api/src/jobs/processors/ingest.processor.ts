import { Job } from 'bull'
import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { PrismaService } from '../../services/prisma.service'
import { UtilitiesService } from '../../utilities/utilities.service'
import {
  Process,
  Processor,
  OnQueueProgress,
  OnQueueCompleted,
} from '@nestjs/bull'

@Processor('ingest')
export class IngestProcessor {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly utilitiesService: UtilitiesService
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

    try {
      await this.prismaService.asset.update({
        where: { id: job.data.assetId },
        data: {
          status: 'INGESTING',
        },
      })

      const { contentType } = await this.utilitiesService.ingestURLToStorage(
        asset.input,
        asset.storageBucket,
        `${asset.storageKey}/original.mp4`
      )

      await this.prismaService.asset.update({
        where: { id: job.data.assetId },
        data: { status: 'READY', contentType },
      })

      console.log('asset injested successfully', job.data)
    } catch (error) {
      console.error('there was an error ingesting the asset', error)
      await this.prismaService.asset.update({
        where: { id: job.data.assetId },
        data: { status: 'ERROR' },
      })

      throw new Error(error)
    }

    await job.progress(100)
    return 'done'
  }
}
