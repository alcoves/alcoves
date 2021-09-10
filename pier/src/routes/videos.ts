import express from 'express'
import { get, list } from '../controllers/videos'

const router = express.Router()

router.get('/', list)
router.get('/:id', get)

export default router