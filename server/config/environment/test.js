'use strict'

// Test specific configuration
// ===========================
const mongoHost =
  process.env.TDUSER_MONGO_HOST || 'pu-dev-shard-00-00-4nodg.mongodb.net:27017,pu-dev-shard-00-01-4nodg.mongodb.net:27017,pu-dev-shard-00-02-4nodg.mongodb.net:27017'

module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://' + mongoHost + '/testing',
    prefix: 'pu_product_',
    options: {
      user: 'pudevelop',
      pass: 'xEbiMFBtX48ObFgC',
      ssl: true,
      replicaSet: 'pu-dev-shard-0',
      authSource: 'admin',
      autoIndex: false, // Don't build indexes
      reconnectTries: 2, // Never stop trying to reconnect
      reconnectInterval: 1000, // Reconnect every 500ms
      poolSize: 1 // Maintain up to 10 socket connections
    }
  },
  nodePass: {
    me: {
      token: 'tdschedule-secret'
    }
  },
  logger: {
    logName: 'pu-product-test-log'
  }
}
