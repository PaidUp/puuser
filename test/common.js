let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server/app').default
let should = chai.should()
var uuid = require('node-uuid')

let request = {
  user: {
    userForm: {
      firstName: 'John',
      lastName: 'Doe',
      email: `${uuid.v4()}@test.com`,
      password: 'testtest',
      type: 'customer'
    }
  }
}

let results = {}


chai.use(chaiHttp)

exports.chai = chai
exports.server = server
exports.should = should
exports.results = results
exports.request = request
