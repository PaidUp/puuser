import express from 'express'
import { UserController } from '@/controllers'
import { auth } from 'pu-common'
import multer from 'multer'
import multerS3 from 'multer-s3'
import connect from 'connect'
import { S3 } from 'aws-sdk'
import config from '@/config/environment'

let s3 = new S3()
// let upload1 = multer({ dest: 'uploads/' })

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.s3.bucket,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname})
    },
    key: function (req, file, cb) {
      cb(null, 'user/avatar/' + req.user._id + '.png')
    }
  })
})

let combinedMiddleware = (function () {
  var chain = connect();
  [auth.validate, upload.single('avatar')].forEach(function (middleware) {
    chain.use(middleware)
  })
  return chain
})()

const router = express.Router()
router.post('/', UserController.signUpEmail)
router.post('/avatar', combinedMiddleware, UserController.avatar)
router.post('/login/fb', UserController.fbLogin)
router.post('/signup/fb', UserController.fbSignUp)
router.post('/login/email', UserController.emailLogin)
router.post('/emails', UserController.getIntoEmails)
router.put('/', auth.validate, UserController.update)
router.put('/recovery', UserController.recovery)
router.put('/reset', UserController.reset)
router.get('/reset/:token', UserController.verifyResetToken)
router.get('/search', auth.validate, UserController.search)
router.get('/current', auth.validate, UserController.current)
router.get('/id/:userId', auth.validate, UserController.getById)
router.get('/email/:email', auth.validate, UserController.getByEmail)
router.get('/token', auth.validate, UserController.refreshToken)
router.get('/all', auth.validate, UserController.getAll)
router.delete('/logout', auth.revoke, (req, res) => res.status(200).end())
router.get('/test', auth.validate, (req, res) => {
  res.status(200).end()
})

export default router
