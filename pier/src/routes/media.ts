import express from 'express'
import { auth } from '../middlewares/auth'
import { create, list } from '../controllers/media'

const router = express.Router()

router.get('/', auth, list)
router.post('/', auth, create)

export default router
