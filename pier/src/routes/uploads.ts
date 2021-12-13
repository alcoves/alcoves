import express from 'express'
import { auth } from '../middlewares/auth'
import { create } from '../controllers/uploads'

const router = express.Router()

router.post('/', auth, create)

export default router
