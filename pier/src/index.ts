import http from 'http'
import app from './app'
import db from './config/db'
import { Server } from 'socket.io'

const port = 4000
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

async function main() {
  io.on('connection', socket => {
    console.log('a user connected')
    socket.on('chat message', msg => {
      console.log('message: ' + msg)
    })

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })

    setInterval(() => {
      socket.broadcast.emit('heartbeat')
    }, 1000)
  })

  server.listen(port, () => {
    console.log(`listening on *:${port}`)
  })
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await db.$disconnect()
  })
