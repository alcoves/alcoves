/* eslint-disable import/first */
require('dotenv').config();

import express from 'express';
import root from './routes/root'

const app = express();
app.use(root)
export default app