import { Elysia } from 'elysia'
import { sessionAuth } from '../lib/middlewares'

export default new Elysia().use(sessionAuth).group('/users', (app) =>
  app.get('/@me', ({ session }) => {
    return {
      id: session?.user?.id,
      email: session?.user?.email,
    }
  })
)
