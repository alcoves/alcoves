import express from 'express'
import { login, loginGoogleSso, register } from '../controllers/auth'

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.post('/google', loginGoogleSso)

export default router
