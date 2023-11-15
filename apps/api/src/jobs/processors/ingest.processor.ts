import { Job } from 'bull'
import { ConfigService } from '@nestjs/config'
import { Process, Processor } from '@nestjs/bull'
import { PrismaService } from '../../services/prisma.service'

@Processor('ingest')
export class IngestProcessor {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {}

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
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await job.progress(i)
    }

    await job.progress(100)
    return 'done'
  }
}
