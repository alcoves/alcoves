import express from 'express'
import { get } from '../controllers/videos'

const router = express.Router()

router.get('/:id', get)

export default router