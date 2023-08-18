import { Queues } from '../types/types'
import { Process, Processor } from '@nestjs/bull'

@Processor(Queues.transcode.name)
export class TranscodeProcessor {
  @Process({
    name: 'transcodeToHLS',
    concurrency: 1,
  })
  async transcodeToHLS(job: any): Promise<any> {
    try {
      console.log('Transcoding video', job.data.videoId)

      await job.progress(100)
      console.log('Job done!')
      return {}
    } catch (error) {
      console.error('Error', error)
    }
  }
}
