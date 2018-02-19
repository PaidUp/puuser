import express from 'express'
// import { isAuthenticated } from '@/util'
import { UserController } from '@/controllers'
import { Auth } from 'pu-common'

const router = express.Router()
router.post('/', UserController.signUpEmail)
router.post('/login/fb', UserController.fbLogin)
router.post('/login/email', UserController.emailLogin)
router.get('/', Auth.validate, UserController.current)
router.delete('/logout', Auth.revoke, (req, res) => res.status(200).end())
router.get('/test', Auth.validate, (req, res) => {
  res.status(200).end()
})

export default router
