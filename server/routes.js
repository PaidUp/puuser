import api from './api'
import cors from 'cors'
import config from '@/config/environment'

var whitelist = config.cors.whitelist
var corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

export default function (app) {
  app.use(cors(corsOptions))

  // Insert routes below
  app.use('/api/v1/user', api)

  app.route('/*').get(function (request, response) {
    response.status(200).json({ PU: 'User!!!' })
  })
}
