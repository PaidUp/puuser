import express from 'express'
import { UserController } from '@/controllers'
import { auth } from 'pu-common'

const router = express.Router()
router.post('/', UserController.signUpEmail)
router.post('/login/fb', UserController.fbLogin)
router.post('/login/email', UserController.emailLogin)
router.get('/', auth.validate, UserController.current)
router.delete('/logout', auth.revoke, (req, res) => res.status(200).end())
router.get('/test', auth.validate, (req, res) => {
  res.status(200).end()
})

export default router
