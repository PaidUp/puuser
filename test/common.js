let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server/app').default
let should = chai.should()
let token = require('../server/config/environment').default.nodePass.me.token
let results = {
  user: {}
}

results.user.payload = {}


chai.use(chaiHttp)

exports.chai = chai
exports.server = server
exports.should = should
exports.token = token
exports.results = results
