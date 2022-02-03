import express from 'express'
import { listPods } from '../controllers/pods'

const router = express.Router()

router.get('/', listPods)

export default router
