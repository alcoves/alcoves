import express from 'express'
import { auth } from '../middlewares/auth'
import { createChannel, getChannels } from '../controllers/channels'
import { createMessage, getMessages } from '../controllers/messages'
import { createHarbor, getHarbors, getHarborById } from '../controllers/harbors'

const router = express.Router()

router.get('/', auth, getHarbors)
router.post('/', auth, createHarbor)
router.get('/:harborId', auth, getHarborById)
router.get('/:harborId/channels', auth, getChannels)
router.post('/:harborId/channels', auth, createChannel)
router.get('/:harborId/channels/:channelId/messages', auth, getMessages)
router.post('/:harborId/channels/:channelId/messages', auth, createMessage)

export default router
