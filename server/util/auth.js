import config from '@/config/environment'
import Redis from '@/db/redis'
import jwt from 'jsonwebtoken'

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */

function serverTokenAuthenticated (req) {
  let token = null
  // allow access_token to be passed through query parameter as well
  if (req.query && req.query.hasOwnProperty('token')) {
    token = req.query.token
  } else if (req.body && req.body.token) {
    token = req.body.token
  } else if (req.query && req.query.hasOwnProperty('access_token')) {
    token = req.query.token
  } else if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1]
  }
  return token
}

export default function (req, res, next) {
  let token = serverTokenAuthenticated(req)
  console.log(token)
  if (!token) {
    return res.sendStatus(401)
  }
  console.log('into auth: ', token)
  jwt.verify(token, config.secrets.session, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(500).end()
    }
    console.log(decoded)
    console.log(typeof decoded)
    Redis.get(decoded.user.email).then(value => {
      console.log('value: ', value)
      if (token !== value) return res.sendStatus(401)
      next()
    }).catch(reason => {
      res.sendStatus(500).json(reason)
    })
  })
}
