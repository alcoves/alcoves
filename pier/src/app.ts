import cors from 'cors'
import morgan from 'morgan'
import express from 'express'
import rootRoutes from './routes/root'
import harborRoutes from './routes/harbors'

const app = express()

app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())

app.use(rootRoutes)
app.use('/harbors', harborRoutes)

export default app
