import { Elysia } from 'elysia'
import { QueueEvents } from 'bullmq'
import { connection } from '../lib/bullmq'

const router = new Elysia()

const queueEvents = new QueueEvents('Paint', { connection })

router.ws('/ws', {
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

export default router
