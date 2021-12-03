import express from 'express'
import { rootController } from '../controllers/root'

const router = express.Router()

router.get('/', rootController)

export default router
