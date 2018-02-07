import path from 'path'
import _ from 'lodash'
import development from './development'
import production from './production'
import test from './test'

const envs = {
  development,
  production,
  test
}

// All configurations will extend these options
// ============================================
let all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(path.join(__dirname, '/../../..')),

  // Server port
  port: process.env.PORT || 9001,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'puproduct-secret'
  },

  nodePass: {
    me: {
      'token': 'puproduct-secret'
    }
  },
  logger: {
    projectId: 'gothic-talent-192920',
    logName: 'pu-product-dev-log',
    metadata: {resource: {type: 'global'}}
  },
  encryptKey: 'PZ3oXv2v6Pq5HAPFI9NFbQ=='
}

// Export the config object based on the NODE_ENV
// ==============================================
export default _.merge(
  all,
  envs[process.env.NODE_ENV] || {})
