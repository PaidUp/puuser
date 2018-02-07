import express from 'express'
// import { isAuthenticated } from '@/util'
import { UserController } from '@/controllers'

const router = express.Router()
router.post('/', UserController.save)
router.post('/fblogin', UserController.fbLogin)
router.get('/', UserController.getById)

export default router
