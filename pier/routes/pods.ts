import express from 'express'
import { auth } from '../middlewares/auth'
import {
  list,
  // create,
  getById,
  // patchById,
  // deleteById,
} from '../controllers/pods'

const router = express.Router()

router.get('/', auth, list)
// router.post('/', auth, create)
router.get('/:id', auth, getById)
// router.patch('/:id', auth, patchById)
// router.delete('/:id', auth, deleteById)

export default router