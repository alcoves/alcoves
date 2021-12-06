import express from 'express'
import { rootController, loginController, registerController } from '../controllers/root'

const router = express.Router()

router.get('/', rootController)
router.post('/login', loginController)
router.post('/register', registerController)

export default router
