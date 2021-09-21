import express from 'express'
import { auth } from '../middlewares/auth'
import { deleteVideo, getVideo } from '../controllers/videos'

const router = express.Router()

router.get('/:videoId', auth, getVideo)
router.delete('/:videoId', auth, deleteVideo)

export default router