import { hash, compare } from 'bcrypt'
import { Elysia, t } from 'elysia'
import { db } from '../lib/prisma'
import { ip } from 'elysia-ip'

const router = new Elysia({ prefix: '/auth' }).use(ip())

router.post(
  '/login',
  async ({ body: { email, password }, error, ip }) => {
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    })

    if (!user) {
      return error(400, 'Bad Request')
    }

    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid) {
      return error(400, 'Bad Request')
    }

    const session = await db.userSession.findFirst({
      where: {
        userId: user.id,
      },
    })

    if (session) {
      return {
        status: 'success',
        message: 'User logged in',
        session_id: session.id,
      }
    } else {
      await db.userSession.create({
        data: {
          userId: user.id,
          ip: ip,
          // userAgent: request.headers['user-agent'],
        },
      })
    }

    return {
      status: 'success',
      message: 'User logged in',
      session_id: user.id,
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
  async ({ body: { email, password }, error }) => {
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    })

    if (user) {
      return error(400, 'Bad Request')
    }

    await db.user.create({
      data: {
        email,
        password: await hash(password, 10),
      },
    })

    return {
      status: 'success',
      message: 'User created',
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
