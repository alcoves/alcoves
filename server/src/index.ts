import './worker' // Starts the worker
import './db/migrate' // Runs database migrations

import { z } from 'zod'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/bun'
import { transcodeQueue } from './tasks'
import { authRouter } from './routes/auth'
import { usersRouter } from './routes/users'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()

app.use(logger())

if (process.env.NODE_ENV === 'production') {
    app.use(
        cors({
            origin: '*',
            credentials: true,
            allowHeaders: [],
            exposeHeaders: ['Content-Length'],
            allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        })
    )
} else {
    app.use(
        cors({
            origin: 'http://localhost:3005',
            credentials: true,
            allowHeaders: [],
            exposeHeaders: ['Content-Length'],
            allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        })
    )
}

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

app.get('/tasks/counts', async (c) => {
    const counts = await transcodeQueue.getJobCounts()
    return c.json({ counts })
})

app.use('/favicon.ico', serveStatic({ path: './src/static/favicon.ico' }))

app.route('/api/auth', authRouter)
app.route('/api/users', usersRouter)

app.use(
    '*',
    serveStatic({
        root: './src/',
        rewriteRequestPath: (path) => path.replace(/^\//, '/static'),
    })
)

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
