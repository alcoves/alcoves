/* eslint-disable import/first */
require('dotenv').config();

import cors from 'cors'
import morgan from 'morgan'
import express from 'express'
import root from './routes/root'
import videos from './routes/videos'
import pods from './routes/pods'

const app = express();
app.use(cors())
app.use(morgan('tiny'))

app.use('/', root)
app.use('/pods', pods)
// app.use('/videos', videos)

export default app