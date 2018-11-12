import { userService, facebookService } from '@/services'
import { HandlerResponse as HR } from 'pu-common'

export default class OrganizationCotroller {
  static signUpEmail (req, res) {
    userService.signUpEmail(req.body)
      .then(user => {
        if (!user) {
          return HR.error(res, {message: 'The specified email address is already in use.'}, 500)
        }
        return HR.send(res, user)
      }).catch(reason => {
        return HR.error(res, reason)
      })
  }

  static search (req, res) {
    if (!req.query.criteria) return HR.error(res, 'Criteria is required', 422)
    const criteria = req.query.criteria
    userService.search(criteria)
      .then(users => HR.send(res, users))
      .catch(reason => HR.error(res, reason))
  }

  static current (req, res) {
    userService.getById(req.user._id).then(user => {
      return HR.send(res, user)
    }).catch(reason => {
      return HR.error(res, reason)
    })
  }

  static getById (req, res) {
    userService.getById(req.params.userId).then(user => {
      return HR.send(res, user)
    }).catch(reason => {
      return HR.error(res, reason)
    })
  }

  static getAll (req, res) {
    userService.getAll().then(users => {
      return HR.send(res, users)
    }).catch(reason => {
      return HR.error(res, reason)
    })
  }

  static getIntoEmails (req, res) {
    const emails = req.body.emails
    if (!emails) return HR.error(res, 'emails are required', 422)
    userService.getIntoEmails(emails).then(users => {
      return HR.send(res, users)
    }).catch(reason => {
      return HR.error(res, reason)
    })
  }

  static getByEmail (req, res) {
    userService.getByEmail(req.params.email).then(user => {
      return HR.send(res, user)
    }).catch(reason => {
      return HR.error(res, reason)
    })
  }

  static fbLogin (req, res) {
    let rememberMe = req.body.rememberMe || false
    let authResponse = req.body.authResponse
    facebookService.fbLogin(authResponse, rememberMe).then(data => {
      return HR.send(res, data)
    }).catch(reason => {
      return HR.error(res, reason)
    })
  }

  static fbSignUp (req, res) {
    let rememberMe = req.body.rememberMe || false
    let accessToken = req.body.accessToken
    let phone = req.body.phone
    if (!phone) {
      return HR.error(res, 'Phone is required', 422)
    }
    facebookService.fbSignUp(accessToken, rememberMe, phone).then(data => {
      return HR.send(res, data)
    }).catch(reason => {
      return HR.error(res, reason)
    })
  }

  static emailLogin (req, res) {
    let { email, password, rememberMe } = req.body
    userService.emailLogin(email, password, rememberMe).then(data => {
      return HR.send(res, data)
    }).catch(reason => {
      return HR.error(res, reason)
    })
  }

  static refreshToken (req, res) {
    let user = req.user
    let rememberMe = req.query.remember
    userService.refreshToken(user._id, rememberMe).then(data => {
      return HR.send(res, data)
    }).catch(reason => {
      return HR.error(res, reason)
    })
  }

  static logout (req, res) {
    let email = req.body.email
    userService.logout(email).then(data => {
      return HR.send(res, data)
    }).catch(reason => {
      return HR.error(res, reason)
    })
  }

  static update (req, res) {
    let { id, values } = req.body
    userService.update(id, values).then(data => {
      return HR.send(res, data)
    }).catch(reason => {
      return HR.error(res, reason)
    })
  }

  static recovery (req, res) {
    let { email, token, password } = req.body
    userService.recovery(email, token, password).then(data => {
      return HR.send(res, data)
    }).catch(reason => {
      return HR.error(res, reason)
    })
  }

  static reset (req, res) {
    let { email } = req.body
    userService.reset(email).then(data => {
      return HR.send(res, data)
    }).catch(reason => {
      return HR.error(res, reason)
    })
  }

  static verifyResetToken (req, res) {
    let token = req.params.token
    userService.verifyResetToken(token).then(data => {
      let resp = false
      if (data) resp = data.email
      return HR.send(res, resp)
    }).catch(reason => {
      return HR.error(res, reason)
    })
  }

  static avatar (req, res) {
    if (!req.file) return HR.error(res, 'files is required', 422)
    return HR.send(res, {})
  }
}
