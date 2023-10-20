import { Job } from 'bull'
import { Process, Processor } from '@nestjs/bull'

@Processor('images')
export class ImagesConsumer {
  @Process({
    concurrency: 4,
    name: 'images_transform',
  })
  async processImageTransform(job: Job<unknown>) {
    console.log('runnign job', job.data)
    await job.progress(100)
    return 'image transform done'
  }
}
