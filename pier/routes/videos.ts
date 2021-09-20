import express from 'express'
import { auth } from '../middlewares/auth'
import { getVideo } from '../controllers/videos'

const router = express.Router()

router.get('/:videoId', auth, getVideo)

export default router