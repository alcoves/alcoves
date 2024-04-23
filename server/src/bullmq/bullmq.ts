import { env } from '../utils/env'
import { Queue } from 'bullmq'

const transcodeQueueName = 'transcode'

export const bullConnection = {
    host: env.ALCOVES_REDIS_HOST,
    port: parseInt(env.ALCOVES_REDIS_PORT),
}

export const transcodeQueue = new Queue(transcodeQueueName, {
    connection: bullConnection,
})
