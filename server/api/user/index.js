import express from 'express'
// import { isAuthenticated } from '@/util'
import { UserController } from '@/controllers'
import auth from '@/util/auth'

const router = express.Router()
router.post('/', UserController.signUpEmail)
router.post('/login/fb', UserController.fbLogin)
router.post('/login/email', UserController.emailLogin)
router.get('/', UserController.getById)
router.get('/test', auth, (req, res) => {
  res.status(200).end()
})

export default router
