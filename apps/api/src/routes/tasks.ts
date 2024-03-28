import { Elysia } from 'elysia'
import { queue } from '../lib/bullmq'

export default new Elysia().group('/tasks', (app) =>
  app
    .post('/tasks', () => {
      queue.add('cars', { color: 'blue' })
    })
    .get('/tasks', async () => {
      const jobs = await queue.getJobs()
      return jobs
    })
)
