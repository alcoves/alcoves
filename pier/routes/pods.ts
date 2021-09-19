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
  getVideo,
  deleteVideo
} from '../controllers/videos'

const router = express.Router()

router.get('/', auth, list)
router.post('/', auth, create)
router.get('/:podId', auth, getById)
router.patch('/:podId', auth, patchById)
router.delete('/:podId', auth, deleteById)

router.get('/:podId/videos', auth, listVideos)
router.post('/:podId/videos', auth, createVideo)

router.get('/:podId/videos/:videoId', auth, getVideo)
// router.patch('/:podId/videos/:videoId', auth, getVideo)
router.delete('/:podId/videos/:videoId', auth, deleteVideo)

export default router