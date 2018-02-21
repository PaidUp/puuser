import FB from 'fb'
import userService from './user.service'

let facebookService

class FacebookService {
  static get instance () {
    if (!facebookService) {
      facebookService = new FacebookService()
    }
    return facebookService
  }

  fbLogin (facebookResponse, rememberMe) {
    return new Promise((resolve, reject) => {
      FB.setAccessToken(facebookResponse.accessToken)
      FB.api('/me', { fields: ['email', 'first_name', 'gender', 'last_name', 'link', 'locale', 'middle_name', 'name', 'timezone', 'updated_time', 'verified'] },
        fbUser => {
          if (fbUser.error) {
            return reject(fbUser.error)
          }
          if (!fbUser.email) {
            FB.api(`/me/permissions`, 'DELETE', resp => {
              // console.log(resp)
            })
            // eslint-disable-next-line
            return reject({
              code: 'ValidationError',
              message: 'Facebook email is required'
            })
          }
          userService.signInFb(fbUser, rememberMe).then(data => {
            resolve(data)
          })
        }
      )
    })
  }
}

export default FacebookService.instance
