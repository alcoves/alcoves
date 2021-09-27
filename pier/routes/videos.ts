import express from 'express'
import { auth } from '../middlewares/auth'
import { deleteVideo, getVideo, patchVideo } from '../controllers/videos'

const router = express.Router()

router.get('/:videoId', auth, getVideo)
router.patch('/:videoId', auth, patchVideo)
router.delete('/:videoId', auth, deleteVideo)

export default router