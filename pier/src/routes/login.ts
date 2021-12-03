import express from 'express'
import { loginController } from '../controllers/login'

const router = express.Router()

router.post('/login', loginController)

export default router
