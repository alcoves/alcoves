import './worker'
import { z } from 'zod'
import { Hono } from 'hono'
import { transcodeQueue } from './bullmq'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()

app.get('/', (c) => {
    return c.text('sup')
})

app.get('/healthcheck', (c) => {
    return c.text('OK')
})

app.get('/tasks', async (c) => {
    const tasks = await transcodeQueue.getJobs()
    return c.json({ tasks })
})

const createTaskSchema = z.object({
    input: z.string(),
    output: z.string(),
    commands: z.string(),
})

app.post('/tasks', zValidator('json', createTaskSchema), async (c) => {
    const { input, output, commands } = c.req.valid('json')
    const job = await transcodeQueue.add('transcode', {
        input,
        output,
        commands,
    })
    return c.json({ job })
})

export default app
