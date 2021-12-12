import express from 'express'
import { auth } from '../middlewares/auth'
import { create, list, getById } from '../controllers/pods'

const router = express.Router()

router.get('/', auth, list)
router.post('/', auth, create)
router.get('/:podId', auth, getById)

export default router
