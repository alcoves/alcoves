/* eslint-disable import/first */
require('dotenv').config();

import express from 'express';
import root from './routes/root'
import videos from './routes/videos'
import compartments from './routes/compartments'

const app = express();

app.use('/', root)
app.use('/videos', videos)
app.use('/compartments', compartments)

export default app