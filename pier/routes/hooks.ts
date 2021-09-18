import express from 'express'
import { patch } from '../controllers/hooks'
import { tidalAuth } from '../middlewares/auth'

const router = express.Router()

router.patch('/tidal/:videoId', tidalAuth, patch)

export default router