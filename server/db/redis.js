import redis from 'redis'
import Logger from '@/util/logger'

const client = redis.createClient(6379, '127.0.0.1')

client.on('connect', function () {
  Logger.info('connected to redis')
})

export default class Redis {
  static set (key, value, expiration = 86400) {
    return new Promise((resolve, reject) => {
      client.set(key, value, (err, reply) => {
        if (err) {
          reject(err)
        }
        client.expire(key, expiration)
        resolve(reply)
      })
    })
  }

  static get (key) {
    return new Promise((resolve, reject) => {
      client.get(key, (err, reply) => {
        if (err) {
          reject(err)
        }
        resolve(reply)
      })
    })
  }

  static del (key) {
    return new Promise((resolve, reject) => {
      client.del(key, (err, reply) => {
        if (err) {
          reject(err)
        }
        resolve(reply)
      })
    })
  }
}
