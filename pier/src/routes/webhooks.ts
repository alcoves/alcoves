import express from 'express'
import { recieveTidalWebhook } from '../controllers/webhooks'

const router = express.Router()

router.post('/tidal', recieveTidalWebhook)

export default router
