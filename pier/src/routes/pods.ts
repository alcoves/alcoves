import express from 'express'
import { auth } from '../middlewares/auth'
import { deletePod, updatePod, createPod, getPod, listPods } from '../controllers/pods'

const router = express.Router()

router.get('/', auth, listPods)
router.post('/', auth, createPod)

router.get('/:podId/', auth, getPod)
router.patch('/:podId/', auth, updatePod)
router.delete('/:podId/', auth, deletePod)

export default router
