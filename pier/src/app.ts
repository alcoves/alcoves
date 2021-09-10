/* eslint-disable import/first */
require('dotenv').config();

import express from 'express';
import root from './routes/root'
import videos from './routes/videos'

const app = express();

app.use('/', root)
app.use('/videos', videos)

export default app