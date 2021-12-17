import express from 'express'
import { root } from '../controllers/root'
import { login } from '../controllers/login'
import { register } from '../controllers/register'

const router = express.Router()

router.get('/', root)
router.post('/login', login)
router.post('/register', register)

export default router
