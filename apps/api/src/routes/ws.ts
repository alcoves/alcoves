import { Elysia } from 'elysia'
import { QueueEvents } from 'bullmq'
import { connection } from '../lib/bullmq'

const queueEvents = new QueueEvents('Paint', { connection })

export default new Elysia().group('/ws', (app) =>
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
)
