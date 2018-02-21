import { userService, facebookService } from '@/services'
import { HandlerResponse } from 'pu-common'

export default class OrganizationCotroller {
  static signUpEmail (req, res) {
    userService.signUpEmail(req.body)
      .then(user => {
        return HandlerResponse.send(res, user)
      }).catch(reason => {
        return HandlerResponse.error(res, reason)
      })
  }
  static current (req, res) {
    userService.getById(req.user._id).then(user => {
      return HandlerResponse.send(res, user)
    }).catch(reason => {
      return HandlerResponse.error(res, reason)
    })
  }

  static fbLogin (req, res) {
    let rememberMe = req.body.rememberMe || false
    let authResponse = req.body.authResponse
    facebookService.fbLogin(authResponse, rememberMe).then(data => {
      return HandlerResponse.send(res, data)
    }).catch(reason => {
      return HandlerResponse.error(res, reason)
    })
  }

  static emailLogin (req, res) {
    let { email, password, rememberMe } = req.body
    userService.emailLogin(email, password, rememberMe).then(data => {
      return HandlerResponse.send(res, data)
    }).catch(reason => {
      return HandlerResponse.error(res, reason)
    })
  }

  static logout (req, res) {
    let email = req.body.email
    userService.logout(email).then(data => {
      return HandlerResponse.send(res, data)
    }).catch(reason => {
      return HandlerResponse.error(res, reason)
    })
  }
}
