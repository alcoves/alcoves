import { Job } from 'bull'
import { Process, Processor } from '@nestjs/bull'
import { PrismaService } from '../../services/prisma.service'

@Processor('ingest')
export class IngestProcessor {
  constructor(private readonly prismaService: PrismaService) {}

  @Process({
    concurrency: 1,
    name: 'ingest_asset',
  })
  async process(job: Job<unknown>) {
    console.log('ingesting asset', job.data)
    await job.progress(100)
    return 'done'
  }
}
