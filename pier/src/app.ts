import cors from 'cors'
import morgan from 'morgan'
import express from 'express'
import rootRoutes from './routes/root'
import harbourRoutes from './routes/harbours'
import channelRoutes from './routes/channels'
import messageRoutes from './routes/messages'

const app = express()

app.use(cors())
app.use(morgan('combined'))
app.use(express.json())

app.use(rootRoutes)
app.use('/harbours', harbourRoutes)
app.use('/:harbourId/channels', channelRoutes)
app.use('/:harbourId/channels/:channelId/messages', messageRoutes)

export default app
