import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { CreateJobDto } from './dto/create-job.dto'

@Injectable()
export class JobsService {
  constructor(@InjectQueue('ingest') private ingestQueue: Queue) {}

  getQueues(): string[] {
    return Object.keys(this).filter((key) => key.includes('Queue'))
  }

  create(createJobDto: CreateJobDto) {
    return 'This action adds a new job'
  }

  async cleanQueues() {
    await Promise.all(
      this.getQueues().map(async (queue) => {
        await this[queue].clean(1000, 'completed')
        await this[queue].clean(1000, 'failed')
      })
    )
    return 'done'
  }

  async findAll() {
    const jobs = await Promise.all(
      this.getQueues().map(async (queue) => {
        const jobs = await this[queue].getJobs([
          'active',
          'waiting',
          'completed',
          'paused',
          'delayed',
          'failed',
        ])
        return jobs
      })
    )

    return jobs.flat().sort((a, b) => b.timestamp - a.timestamp)
  }

  // Job Queue Methods
  async ingestAsset(assetId: string) {
    const job = await this.ingestQueue.add('ingest_asset', {
      assetId,
    })
    return job
  }
}
