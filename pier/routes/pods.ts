import express from 'express'
import { auth } from '../middlewares/auth'
import {
  listPods,
  createPod,
  getPodById,
  patchPodById,
  deletePodById,
} from '../controllers/pods'
import {
  listVideos,
  createVideo,
  createUploadUrl
} from '../controllers/videos'

const router = express.Router()

router.get('/', auth, listPods)
router.post('/', auth, createPod)
router.get('/:podId', auth, getPodById)
router.patch('/:podId', auth, patchPodById)
router.delete('/:podId', auth, deletePodById)

router.get('/:podId/videos', auth, listVideos)
router.post('/:podId/videos/upload', auth, createUploadUrl)

router.post('/:podId/videos/:videoId', auth, createVideo)

export default router