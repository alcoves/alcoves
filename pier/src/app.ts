import cors from 'cors'
import morgan from 'morgan'
import express from 'express'
import rootRoutes from './routes/root'
import userRoutes from './routes/users'
import webhookRoutes from './routes/webhooks'
import libraryRoutes from './routes/libraries'

const app = express()

app.use(cors())
app.use(morgan('tiny'))
app.use(express.json({ limit: '5mb' }))

app.use(rootRoutes)
app.use('/users', userRoutes)
app.use('/webhooks', webhookRoutes)
app.use('/libraries', libraryRoutes)

export default app
