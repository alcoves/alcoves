import { Elysia, t } from 'elysia'

const router = new Elysia({ prefix: '/auth' })

router.post(
  '/login',
  ({ body }) => {
    const { email, password } = body
    console.log({ email, password })
    return {
      message: 'ok',
    }
  },
  {
    body: t.Object({
      email: t.String(),
      password: t.String(),
    }),
  }
)

router.post(
  '/register',
  ({ body }) => {
    const { email, password } = body
    console.log({ email, password })
    return {
      message: 'ok',
    }
  },
  {
    body: t.Object({
      email: t.String(),
      password: t.String(),
    }),
  }
)

export default router
