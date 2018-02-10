import express from 'express'
// import { isAuthenticated } from '@/util'
import { UserController } from '@/controllers'
import { validate, revoke } from '@/util/auth'

const router = express.Router()
router.post('/', UserController.signUpEmail)
router.post('/login/fb', UserController.fbLogin)
router.post('/login/email', UserController.emailLogin)
router.get('/', UserController.getById)
router.delete('/logout', revoke, (req, res) => res.status(200).end())
router.get('/test', validate, (req, res) => {
  res.status(200).end()
})

export default router
