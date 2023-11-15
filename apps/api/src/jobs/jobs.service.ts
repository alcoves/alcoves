import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { CreateJobDto } from './dto/create-job.dto'

@Injectable()
export class JobsService {
  constructor(
    @InjectQueue('images') private imageQueue: Queue,
    @InjectQueue('ingest') private ingestQueue: Queue
  ) {}

  create(createJobDto: CreateJobDto) {
    return 'This action adds a new job'
  }

  async createTestJob() {
    console.log('enqueueing job')
    const job1 = await this.imageQueue.add({
      foo: 'bar',
    })

    const job2 = await this.imageQueue.add('images_transform', {
      foo: 'bar',
    })

    return [job1, job2]
  }

  async cleanQueue() {
    await this.imageQueue.clean(1000, 'completed')
    await this.imageQueue.clean(1000, 'failed')
    return 'done'
  }

  async findAll() {
    const jobs = await this.imageQueue.getJobs([
      'active',
      'waiting',
      'completed',
      'paused',
      'delayed',
      'failed',
    ])
    return jobs
  }

  // Job Queue Methods

  async ingestAsset(assetId: string) {
    const job = await this.ingestQueue.add('ingest_asset', {
      assetId,
    })
    return job
  }
}
