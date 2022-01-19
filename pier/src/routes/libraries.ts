import express from 'express'
import { auth } from '../middlewares/auth'
import {
  patchLibrary,
  getLibraryVideo,
  listLibraryVideos,
  createVideoUpload,
  listUserLibraries,
  createLibraryVideo,
  deleteLibraryVideos,
  completeVideoUpload,
} from '../controllers/libraries'

const router = express.Router()

router.get('/', auth, listUserLibraries)
router.patch('/:libraryId', auth, patchLibrary)

router.get('/:libraryId/videos', auth, listLibraryVideos)
router.post('/:libraryId/videos', auth, createLibraryVideo)
router.delete('/:libraryId/videos', auth, deleteLibraryVideos)

router.get('/:libraryId/videos/:videoId', auth, getLibraryVideo)
router.post('/:libraryId/videos/:videoId/upload', auth, createVideoUpload)
router.put('/:libraryId/videos/:videoId/upload', auth, completeVideoUpload)

export default router
