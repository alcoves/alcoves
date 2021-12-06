import express from 'express'
import { createHarbour, getHarbours, getHarbourById } from '../controllers/harbours'

const router = express.Router()

router.get('/', getHarbours)
router.post('/', createHarbour)
router.get('/:harbourId', getHarbourById)

export default router
