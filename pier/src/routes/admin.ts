import express from 'express'
import { adminAuth } from '../middlewares/auth'
import { listVideos, reprocessVideo, reprocessVideos } from '../controllers/admin'

const router = express.Router()

router.get('/videos', adminAuth, listVideos)
router.post('/videos/reprocess', adminAuth, reprocessVideos)
router.post('/videos/:videoId/reprocess', adminAuth, reprocessVideo)

export default router
