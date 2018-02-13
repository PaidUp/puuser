const mongoHost = process.env.TDUSER_MONGO_HOST || 'pu-dev-shard-00-00-4nodg.mongodb.net:27017,pu-dev-shard-00-01-4nodg.mongodb.net:27017,pu-dev-shard-00-02-4nodg.mongodb.net:27017'

// All configurations will extend these options
// ============================================
let all = {
  env: process.env.NODE_ENV,
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
      poolSize: 5 // Maintain up to 10 socket connections
    }
  },
  redis: {
    host: 'redis-13835.c16.us-east-1-3.ec2.cloud.redislabs.com',
    port: 13835
  },
  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'puproduct-secret'
  },
  logger: {
    projectId: 'gothic-talent-192920',
    logName: 'pu-product-dev-log',
    metadata: {resource: {type: 'global'}}
  },
  encryptKey: 'PZ3oXv2v6Pq5HAPFI9NFbQ=='
}

export default all
