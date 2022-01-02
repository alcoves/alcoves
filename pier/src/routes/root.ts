import express from 'express'
import { login, register, root } from '../controllers/root'

const router = express.Router()

router.get('/', root)
router.post('/login', login)
router.post('/register', register)

export default router
