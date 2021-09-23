import express from 'express'
import { getManifest } from '../controllers/manifests'

const router = express.Router()

router.get('/:videoId', getManifest)

export default router