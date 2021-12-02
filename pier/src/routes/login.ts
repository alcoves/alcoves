import express from 'express'

const router = express.Router()

router.post('/login', (req, res) => {
  res.sendStatus(200)
})

export default router
