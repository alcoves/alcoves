import { Queue } from 'bullmq'
import { env } from '../lib/env'

const transcodeQueueName = 'transcode'

export const bullConnection = {
    host: env.ALCOVES_TASK_DB_HOST,
    port: parseInt(env.ALCOVES_TASK_DB_PORT),
}

export const transcodeQueue = new Queue(transcodeQueueName, {
    connection: bullConnection,
})
