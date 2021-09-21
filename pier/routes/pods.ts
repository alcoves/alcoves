import express from 'express'
import { auth } from '../middlewares/auth'
import {
  list,
  create,
  getById,
  patchById,
  deleteById,
} from '../controllers/pods'
import {
  listVideos,
  createVideo,
  createUploadUrl
} from '../controllers/videos'

const router = express.Router()

router.get('/', auth, list)
router.post('/', auth, create)
router.get('/:podId', auth, getById)
router.patch('/:podId', auth, patchById)
router.delete('/:podId', auth, deleteById)

router.get('/:podId/videos', auth, listVideos)
router.get('/:podId/videos/upload', auth, createUploadUrl)

router.post('/:podId/videos/:videoId', auth, createVideo)

export default router