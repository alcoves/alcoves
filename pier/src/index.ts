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

app.set('io', io)

async function main() {
  io.on('connection', socket => {
    console.log('a user connected')

    socket.on('join', token => {
      console.log('token', token)
      // Go get the harbors a user can join
      socket.join(['shack'])
    })

    socket.on('ping', () => {
      socket.emit('pong')
    })

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
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
