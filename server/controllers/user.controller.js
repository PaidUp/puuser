import { UserService, FacebookService } from '@/services'
import { HandlerResponse } from '@/util'
const userService = new UserService()

export default class OrganizationCotroller {
  static signUpEmail (req, res) {
    let hr = new HandlerResponse(res)
    userService.signUpEmail(req.body)
      .then(user => {
        return hr.send(user)
      }).catch(reason => {
        return hr.error(reason)
      })
  }
  static getById (req, res) {
    let hr = new HandlerResponse(res)
    userService.getById(req.params.organizationId).then(user => {
      return hr.send(user)
    }).catch(reason => {
      return hr.error(reason)
    })
  }

  static fbLogin (req, res) {
    let hr = new HandlerResponse(res)
    let rememberMe = req.body.rememberMe
    let authResponse = req.body.authResponse
    FacebookService.fbLogin(authResponse, rememberMe).then(data => {
      return hr.send(data)
    }).catch(reason => {
      return hr.error(reason)
    })
  }

  static emailLogin (req, res) {
    let hr = new HandlerResponse(res)
    let { email, password, rememberMe } = req.body
    userService.emailLogin(email, password, rememberMe).then(data => {
      return hr.send(data)
    }).catch(reason => {
      return hr.error(reason)
    })
  }
}
