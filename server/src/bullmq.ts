import { env } from './env'
import { Queue } from 'bullmq'

const transcodeQueueName = 'transcode'

export const bullConnection = {
    host: env.redis_host,
    port: parseInt(env.redis_port),
}

export const transcodeQueue = new Queue(transcodeQueueName, {
    connection: bullConnection,
})
