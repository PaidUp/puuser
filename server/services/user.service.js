import { PersonModel } from '@/models'
import CommonService from './common.service'
import crypto from 'crypto'
import { auth } from 'pu-common'

// const personModel = new PersonModel()

function generateFbUser (fbUser, type = 'customer') {
  const newFbUser = {
    firstName: fbUser.first_name,
    lastName: fbUser.last_name,
    email: fbUser.email,
    facebookId: fbUser.id,
    type

  }
  return this.model.save(newFbUser)
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

class UserService extends CommonService {
  constructor () {
    super(new PersonModel())
  }

  getById (entityId) {
    return this.model.findById(entityId).then(user => {
      user = user.toObject()
      delete user.salt
      delete user.hashedPassword
      return user
    })
  }

  update (id, values) {
    return this.model.updateById(id, values)
  }

  signUpEmail (userForm) {
    userForm.salt = getSalt()
    userForm.hashedPassword = encryptPassword(userForm.password, userForm.salt)
    return this.model.save(userForm).then(user => {
      user = user.toObject()
      delete user.salt
      delete user.hashedPassword
      const token = auth.token(user, false)
      return { token, user }
    })
  }

  emailLogin (email, password, rembemberMe = false) {
    return new Promise((resolve, reject) => {
      this.model.findOne({ email: email.toLowerCase() }).then(user => {
        if (!user) return resolve({ error: { message: 'This email is not registered.' } })
        if (user.facebookId) return resolve({ error: { message: 'This a facebook account.' } })
        const encPass = encryptPassword(password, user.salt)
        if (encPass !== user.hashedPassword) resolve({ error: { message: 'Invalid password.' } })
        const token = auth.token(user, rembemberMe)
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
        this.model
          .findOne({ email: fbUser.email })
          .then(user => {
            if (!user || !user._id) {
              generateFbUser(fbUser)
                .then(newUser => {
                  resolve({
                    token: auth.token(newUser, rembemberMe),
                    user: newUser
                  })
                })
                .catch(reason => {
                  reject(reason)
                })
            } else {
              resolve({
                token: auth.token(user, rembemberMe),
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
    return auth.remove()
  }
}

let userService = new UserService()

export default userService
