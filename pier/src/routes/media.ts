import express from 'express'
import { auth } from '../middlewares/auth'
import { complete, create, list, del } from '../controllers/media'

const router = express.Router()

router.get('/', auth, list)
router.post('/', auth, create)
router.put('/', auth, complete)
router.delete('/', auth, del)

export default router
