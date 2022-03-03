import express from 'express'
import { auth } from '../middlewares/auth'
import {
  listVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  createVideoUpload,
  completeVideoUpload,
} from '../controllers/videos'

const router = express.Router()

router.get('/', auth, listVideos)
router.post('/', auth, createVideo)

router.patch('/:videoId', auth, updateVideo)
router.delete('/:videoId', auth, deleteVideo)

router.post('/:videoId/upload', auth, createVideoUpload)
router.patch('/:videoId/upload', auth, completeVideoUpload)

export default router
