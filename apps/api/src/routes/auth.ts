import { Elysia, t } from 'elysia'
import { db } from '../lib/prisma'
import { hash, compare } from 'bcrypt'
import { getIP } from '../lib/getIp'

const router = new Elysia({ prefix: '/auth' })

router.post(
  '/login',
  async ({ body: { email, password }, error, request }) => {
    const ip = getIP(request.headers) || 'unknown'
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    })

    if (!user) return error(400, 'Bad Request')
    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid) return error(400, 'Bad Request')

    const session = await db.userSession.findFirst({
      where: {
        ip,
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
      const session = await db.userSession.create({
        data: {
          ip,
          userId: user.id,
        },
      })

      return {
        status: 'success',
        message: 'User logged in',
        session_id: session.id,
      }
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
  async ({ body: { email, password }, error, request }) => {
    const ip = getIP(request.headers) || 'unknown'
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    })

    if (user) return error(400, 'Bad Request')

    const newUser = await db.user.create({
      data: {
        email,
        password: await hash(password, 10),
      },
    })

    const session = await db.userSession.create({
      data: {
        ip,
        userId: newUser.id,
      },
    })

    return {
      status: 'success',
      message: 'User created',
      session_id: session.id,
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
