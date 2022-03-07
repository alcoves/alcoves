import express from 'express'
import { auth } from '../middlewares/auth'
import {
  listVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  createVideoUpload,
  completeVideoUpload,
  getVideo,
} from '../controllers/videos'

const router = express.Router()

router.get('/', auth, listVideos)
router.post('/', auth, createVideo)

// Endpoint is used to display public videos on v/${videoId}
router.get('/:videoId', getVideo)

router.patch('/:videoId', auth, updateVideo)
router.delete('/:videoId', auth, deleteVideo)

router.post('/:videoId/upload', auth, createVideoUpload)
router.patch('/:videoId/upload', auth, completeVideoUpload)

export default router
