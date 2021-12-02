import express from 'express'
import rootRoute from './routes/root'
import loginRoute from './routes/login'
import registerRoute from './routes/register'

const app = express()

app.use(rootRoute)
app.use(loginRoute)
app.use(registerRoute)

export default app
