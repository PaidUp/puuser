import { UserModel } from '@/models'
import CommonService from './common.service'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
// import config from '@/config'
// import uuid from 'node-uuid'

var TOKEN_EXPIRATION = 60
var TOKEN_EXPIRATION_MIN = TOKEN_EXPIRATION * 1
var TOKEN_EXPIRATION_MAX = TOKEN_EXPIRATION * 60 * 24 * 365

const userModel = new UserModel()

function signToken (user, rembemberMe) {
  let expireTime = TOKEN_EXPIRATION_MIN * 60
  if (rembemberMe) {
    expireTime = TOKEN_EXPIRATION_MAX * 60
  }
  let token = jwt.sign({ user }, 'config.secrets.session', {
    expiresIn: expireTime
  })
  return token
}

function generateFbUser (fbUser) {
  const newFbUser = {
    firstName: fbUser.first_name,
    lastName: fbUser.last_name,
    email: fbUser.email,
    facebook: {
      id: fbUser.id,
      email: fbUser.email
    },
    verify: {
      status: 'verified',
      updatedAt: Date.now
    }
  }
  return userModel.save(newFbUser)
}

function getSalt () {
  return crypto.randomBytes(16).toString('base64')
}

function encryptPassword (password, salt) {
  var salt_ = Buffer.from(salt, 'base64')
  return crypto
    .pbkdf2Sync(password, salt_, 10000, 64, 'SHA1')
    .toString('base64')
}

export default class UserService extends CommonService {
  constructor () {
    super(userModel)
  }

  save (userForm) {
    userForm.salt = getSalt()
    userForm.hashedPassword = encryptPassword(userForm.password, userForm.salt)
    return userModel.save(userForm).then(user => {
      const token = signToken(user, false)
      return { token, user }
    })
  }

  signInFb (fbUser, rembemberMe) {
    return new Promise((resolve, reject) => {
      userModel
        .findOne({ email: fbUser.email })
        .then(user => {
          if (!user || !user._id) {
            generateFbUser(fbUser).then(newUser => {
              resolve({
                token: signToken(newUser, rembemberMe),
                user: newUser
              })
            }).catch(reason => {
              reject(reason)
            })
          } else {
            resolve({
              token: signToken(user, rembemberMe),
              user: user
            })
          }
        })
        .catch(reason => {
          reject(reason)
        })
    })
  }
}
