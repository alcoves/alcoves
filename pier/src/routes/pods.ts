import express from 'express'
import {
  list,
  create,
  getById,
  patchById,
  deleteById,
} from '../controllers/pods'

const router = express.Router()

router.get('/', list)
router.post('/', create)
router.get('/:id', getById)
router.patch('/:id', patchById)
router.delete('/:id', deleteById)

export default router