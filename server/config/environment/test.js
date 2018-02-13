// Development specific configuration
// ==================================
const mongoHost = process.env.TDUSER_MONGO_HOST || 'pu-dev-shard-00-00-4nodg.mongodb.net:27017,pu-dev-shard-00-01-4nodg.mongodb.net:27017,pu-dev-shard-00-02-4nodg.mongodb.net:27017'
module.exports = {
  port: process.env.PORT || 9001,
  mongo: {
    uri: 'mongodb://' + mongoHost + '/testing',
    prefix: 'pu_user_',
    options: {
      user: 'pudevelop',
      pass: 'xEbiMFBtX48ObFgC',
      ssl: true,
      replicaSet: 'pu-dev-shard-0',
      authSource: 'admin',
      autoIndex: false, // Don't build indexes
      reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
      reconnectInterval: 1000, // Reconnect every 500ms
      poolSize: 5 // Maintain up to 5 socket connections
    }
  },
  redis: {
    host: 'develop-001.rd7ge9.0001.use1.cache.amazonaws.com',
    port: 6379
  },
  logger: {
    projectId: 'gothic-talent-192920',
    logName: 'pu-product-test-log',
    metadata: {resource: {type: 'global'}}
  }
}
