import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/bun'
import { startWorkers } from './tasks'

import { authRouter } from './routes/auth'
import { rootRouter } from './routes/root'
import { usersRouter } from './routes/users'
import { migrateDatabase } from './db/migrate'
// import { assetsRouter } from './routes/assets'

await migrateDatabase()
await startWorkers()

const app = new Hono()

app.use(logger())

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

export default app
