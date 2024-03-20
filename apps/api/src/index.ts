import authRouter from './routes/auth'

import { sleep } from 'bun'
import { Elysia } from 'elysia'
import { db } from './lib/prisma'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { Queue, Worker, QueueEvents } from 'bullmq'

const redisConnection = {
  connection: {
    host: 'redis',
    port: 6379,
  },
}

const queue = new Queue('Paint', {
  ...redisConnection,
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 1000,
  },
})

const queueEvents = new QueueEvents('Paint', redisConnection)

const app = new Elysia()

const root = new Elysia()
  .get('/', () => 'Hello')
  .get('/health', () => 'Healthy')

app.post('/tasks', () => {
  queue.add('cars', { color: 'blue' })
})

app.get('/tasks', async () => {
  const jobs = await queue.getJobs()
  return jobs
})

app.ws('/ws', {
  open(ws) {
    queueEvents.on('completed', ({ jobId: string }) => {
      ws.send('completed')
    })

    queueEvents.on(
      'progress',
      ({ jobId, data }: { jobId: string; data: number | object }) => {
        ws.send('update')
      }
    )
  },
  message(ws, message) {
    ws.send(message)
  },
})

app
  .use(root)
  .use(authRouter)
  .use(cors())
  .use(swagger({ autoDarkMode: true, path: '/schema' }))
  .listen(4000)
  .onStart(() => {
    console.log(
      `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
    )
  })
  .onStop(async () => {
    await db.$disconnect()
  })

const worker = new Worker(
  'Paint',
  async (job) => {
    if (job.name === 'cars') {
      await sleep(1000)
      await job.updateProgress(1)

      await sleep(1000)
      await job.updateProgress(5)

      await sleep(1000)
      await job.updateProgress(8)

      await sleep(1000)
      await job.updateProgress(12)

      await sleep(1000)
      await job.updateProgress(15)

      await sleep(1000)
      await job.updateProgress(24)

      await sleep(1000)
      await job.updateProgress(32)

      await sleep(1000)
      await job.updateProgress(33)

      await sleep(1000)
      await job.updateProgress(34)

      await sleep(1000)
      await job.updateProgress(55)

      await sleep(1000)
      await job.updateProgress(72)

      await sleep(1000)
      await job.updateProgress(84)

      await sleep(1000)
      await job.updateProgress(90)

      await sleep(1000)
      await job.updateProgress(95)

      await job.updateProgress(100)
      console.log('painted car')
    }
  },
  redisConnection
)

export type App = typeof app
