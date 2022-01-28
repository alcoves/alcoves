import express from 'express'
import { adminAuth } from '../middlewares/auth'
import { reprocessVideos } from '../controllers/admin'

const router = express.Router()

router.post('/videos/reprocess', adminAuth, reprocessVideos)

export default router
