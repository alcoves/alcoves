import express from 'express'
import { get, patch } from '../controllers/jobs'
import { tidalAuth } from '../middlewares/auth'

const router = express.Router()

router.get('/', get)
router.patch('/:jobId', tidalAuth, patch)

export default router