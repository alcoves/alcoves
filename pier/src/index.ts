import app from './app'
import db from './config/db'
import jwt from 'jsonwebtoken'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { createClient } from 'redis'
import { createAdapter } from '@socket.io/redis-adapter'

function redisConnectionStringFactory() {
  const host = process.env.REDIS_HOST
  const port = process.env.REDIS_PORT
  const password = process.env.REDIS_PASSWORD

  return `redis://default:${password}@${host}:${port}`
}

const port = 4000
const server = createServer(app)
export const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

app.set('io', io)

async function main() {
  const pubClient = createClient({ url: redisConnectionStringFactory() })
  const subClient = pubClient.duplicate()
  await Promise.all([pubClient.connect(), subClient.connect()])
  io.adapter(createAdapter(pubClient, subClient))

  io.on('connection', socket => {
    console.log('connection established')

    socket.on('join', token => {
      const user: any = jwt.decode(token)
      if (user?.id) {
        console.log(`${user.id} is joining`)
        socket.join(user.id)
        socket.emit('user has joined')
      } else {
        console.log(`user ${user} tried to join`)
      }
    })

    socket.on('ping', () => {
      console.log('pong')
      socket.emit('pong')
    })

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })

  server.listen(port, () => {
    console.log(`listening on *:${port}`)
    console.log(`Tidal URL: ${process.env.TIDAL_URL}`)
    console.log(`Server Ready`)
  })
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await db.$disconnect()
  })
