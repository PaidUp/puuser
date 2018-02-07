import api from './api'
import cors from 'cors'

var whitelist = ['http://localhost:8080']
var corsOptions = {
  origin: function (origin, callback) {
    if (origin) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    } else {
      callback(null, true)
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
