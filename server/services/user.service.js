import { PersonModel } from '@/models'
import CommonService from './common.service'
import crypto from 'crypto'
import { Auth } from 'pu-common'

const personModel = new PersonModel()

function generateFbUser (fbUser, type = 'customer') {
  const newFbUser = {
    firstName: fbUser.first_name,
    lastName: fbUser.last_name,
    email: fbUser.email,
    facebookId: fbUser.id,
    type

  }
  return personModel.save(newFbUser)
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

let userService

class UserService extends CommonService {
  constructor () {
    super(personModel)
  }

  static get instance () {
    if (!userService) {
      userService = new UserService()
    }
    return userService
  }

  signUpEmail (userForm) {
    userForm.salt = getSalt()
    userForm.hashedPassword = encryptPassword(userForm.password, userForm.salt)
    return personModel.save(userForm).then(user => {
      user = user.toObject()
      delete user.salt
      delete user.hashedPassword
      const token = Auth.token(user, false)
      return { token, user }
    })
  }

  emailLogin (email, password, rembemberMe = false) {
    return new Promise((resolve, reject) => {
      personModel.findOne({ email: email.toLowerCase() }).then(user => {
        if (!user) return resolve({ error: { message: 'This email is not registered.' } })
        if (user.facebookId) return resolve({ error: { message: 'This a facebook account.' } })
        const encPass = encryptPassword(password, user.salt)
        if (encPass !== user.hashedPassword) resolve({ error: { message: 'Invalid password.' } })
        const token = Auth.token(user, rembemberMe)
        user = user.toObject()
        delete user.salt
        delete user.hashedPassword
        resolve({ user, token })
      }).catch(reason => {
        reject(reason)
      })
    })
  }

  signInFb (fbUser, rembemberMe) {
    return new Promise((resolve, reject) => {
      try {
        personModel
          .findOne({ email: fbUser.email })
          .then(user => {
            if (!user || !user._id) {
              generateFbUser(fbUser)
                .then(newUser => {
                  resolve({
                    token: Auth.token(newUser, rembemberMe),
                    user: newUser
                  })
                })
                .catch(reason => {
                  reject(reason)
                })
            } else {
              resolve({
                token: Auth.token(user, rembemberMe),
                user: user
              })
            }
          })
          .catch(reason => {
            reject(reason)
          })
      } catch (error) {
        reject(error)
      }
    })
  }

  logout (email) {
    return Auth.remove()
  }
}

export default UserService.instance
