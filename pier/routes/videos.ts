import express from 'express'
import { auth } from '../middlewares/auth'
import { deleteVideoById, getVideoById } from '../controllers/videos'

const router = express.Router()

router.get('/:videoId', auth, getVideoById)
// router.patch('/:videoId', auth, patchVideoById)
router.delete('/:videoId', auth, deleteVideoById)

export default router