import { Elysia } from 'elysia'
import { queue } from '../lib/bullmq'

const router = new Elysia()

router.post('/tasks', () => {
  queue.add('cars', { color: 'blue' })
})

router.get('/tasks', async () => {
  const jobs = await queue.getJobs()
  return jobs
})

export default router
