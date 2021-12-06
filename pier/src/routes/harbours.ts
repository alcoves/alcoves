import express from 'express'
import { auth } from '../middlewares/auth'
import { createHarbour, getHarbours, getHarbourById } from '../controllers/harbours'

const router = express.Router()

router.get('/', auth, getHarbours)
router.post('/', auth, createHarbour)
router.get('/:harbourId', auth, getHarbourById)

export default router
