import express from 'express'
import { auth } from '../middlewares/auth'
import {
  patchLibrary,
  listLibraryVideos,
  createVideoUpload,
  listUserLibraries,
  createLibraryVideo,
  deleteLibraryVideo,
  completeVideoUpload,
} from '../controllers/libraries'

const router = express.Router()

router.get('/', auth, listUserLibraries)
router.patch('/:libraryId', auth, patchLibrary)

router.get('/:libraryId/videos', auth, listLibraryVideos)

router.post('/:libraryId/videos', auth, createLibraryVideo)
router.post('/:libraryId/videos/:videoId/upload', auth, createVideoUpload)
router.put('/:libraryId/videos/:videoId/upload', auth, completeVideoUpload)
router.delete('/:libraryId/videos/:videoId', auth, deleteLibraryVideo)

export default router
