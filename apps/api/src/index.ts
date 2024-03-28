import wsRouter from './routes/ws'
import authRouter from './routes/auth'
import rootRouter from './routes/root'
import taskRouter from './routes/tasks'
import usersRouter from './routes/users'

import { ip } from 'elysia-ip'
import { Elysia } from 'elysia'
import { db } from './lib/prisma'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()

app
  .use(ip())
  .use(cors())
  .use(swagger({ autoDarkMode: true, path: '/schema' }))
  .use(wsRouter)
  .use(rootRouter)
  .use(authRouter)
  .use(taskRouter)
  .use(usersRouter)
  .listen(4000)
  .onStop(async () => {
    console.log('Server is shutting down...')
    await db.$disconnect()
  })

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)

export default app
export type App = typeof app
