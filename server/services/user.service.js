import { PersonModel } from '@/models'
import CommonService from './common.service'
import crypto from 'crypto'
import { auth, Email } from 'pu-common'
import config from '@/config/environment'

const mail = new Email(config.email.options)
// const personModel = new PersonModel()

function generateFbUser (fbUser, phone, type = 'customer') {
  const newFbUser = {
    firstName: fbUser.first_name,
    lastName: fbUser.last_name,
    email: fbUser.email,
    facebookId: fbUser.id,
    phone: phone,
    type

  }
  return newFbUser
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

  getByEmail (email) {
    return this.model.findOne({email}).then(user => {
      user = user.toObject()
      delete user.salt
      delete user.hashedPassword
      return user
    })
  }

  getAll () {
    return this.model.find({}).then(users => {
      return users.map(user => {
        return {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        }
      })
    })
  }

  verifyResetToken (token) {
    return this.model.findOne({ 'verify.token': token, 'verify.status': 'active' }).then(user => {
      return user
    })
  }

  update (id, values) {
    if (values.password && values.password.trim().length > 0) {
      values.salt = getSalt()
      values.hashedPassword = encryptPassword(values.password, values.salt)
    }
    return this.model.updateById(id, values).then(user => {
      user = user.toObject()
      delete user.salt
      delete user.hashedPassword
      return user
    })
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

  refreshToken (entityId, rembemberMe) {
    return new Promise((resolve, reject) => {
      this.model.findById(entityId).then(user => {
        user = user.toObject()
        delete user.salt
        delete user.hashedPassword
        const token = auth.token(user, rembemberMe)
        resolve(token)
      }).catch(reason => reject(reason))
    })
  }

  fbSignUp (fbUser, rembemberMe, phone) {
    return new Promise((resolve, reject) => {
      try {
        this.model
          .findOne({ email: fbUser.email })
          .then(user => {
            if (!user || !user._id) {
              const fbu = generateFbUser(fbUser, phone)
              this.model.save(fbu).then(newUser => {
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

  fbLogin (fbUser, rembemberMe) {
    return new Promise((resolve, reject) => {
      try {
        this.model
          .findOne({ email: fbUser.email })
          .then(user => {
            if (!user || !user._id) {
              resolve({
                code: 'ValidationError',
                message: 'Facebook account require signup first',
                fbUser
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

  reset (email) {
    let token = crypto.randomBytes(16).toString('hex')
    return userService.findOneAndUpdate({ email, facebookId: { '$exists': false } }, { verify: {
      token,
      updatedAt: new Date(),
      status: 'active'
    }}).then(data => {
      if (data) {
        mail.sendTemplate(data.email, config.email.templates.reset.id, {
          userFirstName: data.firstName,
          resetPasswordURL: config.email.templates.reset.baseUrl + '/' + token
        })
      }
      return data
    })
  }

  recovery (email, token, password) {
    const salt = getSalt()
    return userService.findOneAndUpdate({ 'verify.status': 'active', 'verify.token': token, email, facebookId: { '$exists': false } }, {
      salt,
      hashedPassword: encryptPassword(password, salt),
      'verify.status': 'inactive'
    }).then(user => {
      user = user.toObject()
      delete user.salt
      delete user.hashedPassword
      return user
    })
  }
}

let userService = new UserService()

export default userService
