import './db/migrate' // Runs database migrations

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/bun'

import { authRouter } from './routes/auth'
import { usersRouter } from './routes/users'
import { assetsRouter } from './routes/assets'

const app = new Hono()

app.use(logger())

// import { compress } from 'hono/compress'
// https://hono.dev/docs/middleware/builtin/compress
// Bun: This middleware uses CompressionStream which is not yet supported in bun.
// app.use(compress())

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
    return c.json({ status: 'ok' })
})

app.get('/healthcheck', (c) => {
    return c.json({ status: 'ok' })
})

app.use('/favicon.ico', serveStatic({ path: './src/static/favicon.ico' }))

app.route('/api/auth', authRouter)
app.route('/api/users', usersRouter)
app.route('/api/assets', assetsRouter)

app.use(
    '*',
    serveStatic({
        root: './src/',
        rewriteRequestPath: (path) => path.replace(/^\//, '/static'),
    })
)

// import { z } from 'zod'
// import { transcodeQueue } from './tasks'
// import { zValidator } from '@hono/zod-validator'

// const createTaskSchema = z.object({
//     input: z.string(),
//     output: z.string(),
//     commands: z.string(),
// })

// app.get('/tasks', async (c) => {
//     const tasks = await transcodeQueue.getJobs()
//     return c.json({ tasks })
// })

// app.get('/tasks/counts', async (c) => {
//     const counts = await transcodeQueue.getJobCounts()
//     return c.json({ counts })
// })

// app.post('/tasks', zValidator('json', createTaskSchema), async (c) => {
//     const { input, output, commands } = c.req.valid('json')
//     const job = await transcodeQueue.add('transcode', {
//         input,
//         output,
//         commands,
//     })
//     return c.json({ job })
// })

export default app
