import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/bun'

import imageWorker from './tasks/tasks/images'

import { authRouter } from './routes/auth'
import { rootRouter } from './routes/root'
import { usersRouter } from './routes/users'
// import { assetsRouter } from './routes/assets'

const app = new Hono()

app.use(logger())

// import { compress } from 'hono/compress'
// https://hono.dev/docs/middleware/builtin/compress
// Bun: This middleware uses CompressionStream which is not yet supported in bun.
// app.use(compress())

const defaultCorsOptions = {
    origin: '*',
    credentials: true,
    allowHeaders: [],
    exposeHeaders: ['Content-Length'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}

if (process.env.NODE_ENV !== 'production') {
    app.use(
        cors({
            ...defaultCorsOptions,
            origin: 'http://localhost:3005',
        })
    )
} else {
    app.use(cors(defaultCorsOptions))
}

app.use('/favicon.ico', serveStatic({ path: './src/static/favicon.ico' }))

app.route('/', rootRouter)
app.route('/api/auth', authRouter)
app.route('/api/users', usersRouter)
// app.route('/api/assets', assetsRouter)

app.use(
    '*',
    serveStatic({
        root: './src/',
        rewriteRequestPath: (path) => path.replace(/^\//, '/static'),
    })
)

console.log('Booting up worker...')
imageWorker()

export default app
