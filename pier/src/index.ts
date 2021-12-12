import http from 'http'
import app from './app'
import db from './config/db'
// import jwt from 'jsonwebtoken'
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
  // io.on('connection', socket => {
  //   console.log('a user connected')

  //   socket.on('join', async token => {
  //     const user: any = jwt.decode(token)
  //     const memberships = await db.membership.findMany({
  //       where: { userId: user.id },
  //     })
  //     const harborIds = memberships.map(membership => {
  //       return membership.harborId
  //     })
  //     console.log(`${user.id} is joining ${JSON.stringify(harborIds)}`)
  //     socket.join(harborIds)
  //   })

  //   socket.on('ping', () => {
  //     socket.emit('pong')
  //   })

  //   socket.on('disconnect', () => {
  //     console.log('user disconnected')
  //   })
  // })

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
