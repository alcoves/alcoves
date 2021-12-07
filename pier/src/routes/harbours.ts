import express from 'express'
import { auth } from '../middlewares/auth'
import { createChannel, getChannels } from '../controllers/channels'
import { createMessage, getMessages } from '../controllers/messages'
import { createHarbour, getHarbours, getHarbourById } from '../controllers/harbours'

const router = express.Router()

router.get('/', auth, getHarbours)
router.post('/', auth, createHarbour)
router.get('/:harbourId', auth, getHarbourById)
router.get('/:harbourId/channels', auth, getChannels)
router.post('/:harbourId/channels', auth, createChannel)
router.get('/:harbourId/channels/:channelId/messages', auth, getMessages)
router.post('/:harbourId/channels/:channelId/messages', auth, createMessage)

export default router
