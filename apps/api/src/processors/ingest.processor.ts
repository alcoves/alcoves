import { Job } from 'bull'
import { Queues } from '../types/types'
import { ConfigService } from '@nestjs/config'
import { Process, Processor } from '@nestjs/bull'
import { PrismaService } from '../services/prisma.service'

@Processor(Queues.ingest)
export class IngestProcessor {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {}

  @Process({
    concurrency: 10,
  })
  async ingest(job: Job<unknown>): Promise<any> {
    try {
      let progress = 0
      for (let i = 0; i < 100; i++) {
        progress += 1
        await job.progress(progress)
      }
      return {}
    } catch (error) {
      console.error('Error')
    }
  }
}
