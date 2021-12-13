import express from 'express'
import { auth } from '../middlewares/auth'
import { create, list, getById, del } from '../controllers/pods'

const router = express.Router()

router.get('/', auth, list)
router.post('/', auth, create)
router.delete('/:podId', auth, del)
router.get('/:podId', auth, getById)

export default router
