import express from 'express'
import { getMessages, createMessage } from '../controllers/messages'

const router = express.Router()

router.get('/', getMessages)
router.post('/', createMessage)

export default router
