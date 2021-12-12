import express from 'express'
import { create } from '../controllers/uploads'

const router = express.Router()

router.post('/', create)

export default router
