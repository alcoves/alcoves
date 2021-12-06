import express from 'express'
import { getChannels, createChannel } from '../controllers/channels'

const router = express.Router()

router.get('/', getChannels)
router.post('/', createChannel)

export default router
