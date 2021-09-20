/* eslint-disable import/first */
require('dotenv').config();

import cors from 'cors'
import morgan from 'morgan'
import express from 'express'
import root from './routes/root'
import pods from './routes/pods'
import jobs from './routes/jobs'
import videos from './routes/videos'
import mongoose, { ConnectOptions } from 'mongoose';

if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI must be defined!")
mongoose.connect(process.env.MONGODB_URI as string, {
  tls: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tlsCAFile: './ca-certificate.crt'
} as ConnectOptions);

const app = express();
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

app.use('/', root)
app.use('/pods', pods)
app.use('/jobs', jobs)
app.use('/videos', videos)

export default app