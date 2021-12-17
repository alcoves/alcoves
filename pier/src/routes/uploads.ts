import express from 'express'
import { auth } from '../middlewares/auth'
import { createUpload } from '../controllers/createUpload'
import { completeUpload } from '../controllers/completeUpload'

const router = express.Router()

router.post('/', auth, createUpload)
router.put('/', auth, completeUpload)

export default router
