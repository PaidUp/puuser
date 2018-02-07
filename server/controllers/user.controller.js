import { UserService, FacebookService } from '@/services'
import { HandlerResponse } from '@/util'
const userService = new UserService()

export default class OrganizationCotroller {
  static save (req, res) {
    let hr = new HandlerResponse(res)
    userService.save(req.body)
      .then(user => {
        return hr.send(user)
      }).catch(reason => {
        return hr.error(reason)
      })
  }
  static getById (req, res) {
    let hr = new HandlerResponse(res)
    userService.getById(req.params.organizationId).then(organization => {
      return hr.send(organization)
    }).catch(reason => {
      return hr.error(reason)
    })
  }

  static fbLogin (req, res) {
    let hr = new HandlerResponse(res)
    let rememberMe = req.body.rememberMe
    let authResponse = req.body.authResponse
    FacebookService.fbLogin(authResponse, rememberMe).then(organization => {
      return hr.send(organization)
    }).catch(reason => {
      return hr.error(reason)
    })
  }
}
