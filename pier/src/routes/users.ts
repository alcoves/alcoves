import express from 'express'
import { auth } from '../middlewares/auth'
import { getUserAccount, patchUser } from '../controllers/users'

const router = express.Router()

router.patch('/:userId', auth, patchUser)
router.get('/:userId/account', auth, getUserAccount)

export default router
