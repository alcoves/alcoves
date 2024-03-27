import { sleep } from 'bun'
import { Job, Queue, Worker } from 'bullmq'

export const connection = {
  host: 'redis',
  port: 6379,
}

export const queue = new Queue('Paint', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 1000,
  },
})

const worker = new Worker(
  queue.name,
  async (job: Job) => {
    await sleep(1000)
    await job.updateProgress(100)
    return 'done'
  },
  { connection }
)
