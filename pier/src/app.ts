import cors from 'cors'
import morgan from 'morgan'
import express from 'express'
import rootRoutes from './routes/root'
import userRoutes from './routes/users'
import authRoutes from './routes/auth'
import adminRoutes from './routes/admin'
import videoRoutes from './routes/videos'
import webhookRoutes from './routes/webhooks'

const app = express()

app.use(cors())
app.use(morgan('tiny'))
app.use(express.json({ limit: '5mb' }))

app.use(rootRoutes)
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/admin', adminRoutes)
app.use('/videos', videoRoutes)
app.use('/webhooks', webhookRoutes)

export default app
