import Elysia from 'elysia'
import { db } from './prisma'

export const sessionAuth = new Elysia().derive(
  { as: 'global' },
  // @ts-ignore, type inference is not working - https://github.com/harshmangalam/elysia-blog-api
  async ({ request, error, ip }) => {
    console.log(ip.address)

    const authorization = request?.headers.get('Authorization')
    const sessionId = authorization?.split(' ')[1]

    if (!sessionId) return error(401, 'Unauthorized')

    const session = await db.userSession.findFirst({
      where: { id: sessionId },
      include: { user: true },
    })

    if (!session) return error(401, 'Unauthorized')

    return {
      session: {
        id: sessionId,
        user: {
          id: session.user.id,
          email: session.user.email,
        },
      },
    }
  }
)
