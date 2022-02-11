import express from 'express'
import { loginGoogleSso } from '../controllers/auth'

const router = express.Router()

router.post('/google', loginGoogleSso)

export default router
