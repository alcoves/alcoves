import { Job } from 'bull'
import { Queues } from '../types/types'
import { Process, Processor } from '@nestjs/bull'
import { PrismaService } from '../services/prisma.service'

@Processor('ingest')
export class IngestProcessor {
  constructor(private prisma: PrismaService) {}

  @Process({
    name: 'transcode',
    concurrency: 10,
  })
  async transcode(job: Job<unknown>): Promise<any> {
    try {
      let progress = 0
      for (let i = 0; i < 100; i++) {
        progress += 1
        await job.progress(progress)
      }
      console.log('Job done!')
      return {}
    } catch (error) {
      console.error('Error')
    }
  }
}
