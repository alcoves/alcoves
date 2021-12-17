import express from 'express'
import { auth } from '../middlewares/auth'
import { listPods } from '../controllers/listPods'
import { patchPod } from '../controllers/patchPod'
import { createPod } from '../controllers/createPod'
import { deletePod } from '../controllers/deletePod'
import { addPodMedia } from '../controllers/addPodMedia'
import { listPodMedia } from '../controllers/listPodMedia'
import { removePodMedia } from '../controllers/removePodMedia'

const router = express.Router()

router.get('/', auth, listPods)
router.post('/', auth, createPod)

router.patch('/:podId', auth, patchPod)
router.delete('/:podId', auth, deletePod)

router.get('/:podId/media', auth, listPodMedia)
router.post('/:podId/media', auth, addPodMedia)
router.delete('/:podId/media', auth, removePodMedia)

export default router
