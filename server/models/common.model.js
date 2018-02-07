import mongoose from 'mongoose'
import config from '@/config/environment'

export default class CommonModel {
  constructor (name, document, schemaObj) {
    schemaObj['createAt'] = { type: Date, default: Date.now }
    schemaObj['updateAt'] = { type: Date, default: Date.now }
    this.schema = new mongoose.Schema(schemaObj)
    this.Model = mongoose.model(
      name,
      this.schema,
      config.mongo.prefix + document
    )
    this.schema.pre('save', function (next) {
      if (!this.isNew) return next()
      this.updated = new Date()
      next()
    })
  }

  save (pp) {
    return new Promise((resolve, reject) => {
      try {
        let model = new this.Model(pp)
        model.save((err, data) => {
          if (err) {
            return reject(err)
          }
          return resolve(data)
        })
      } catch (error) {
        return reject(error)
      }
    })
  }

  find (filter) {
    return new Promise((resolve, reject) => {
      try {
        this.Model.find(filter, (err, data) => {
          if (err) return reject(err)
          resolve(data)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  findOne (filter) {
    return new Promise((resolve, reject) => {
      try {
        this.Model.findOne(filter, (err, data) => {
          if (err) return reject(err)
          resolve(data)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  updateById (id, value) {
    return new Promise((resolve, reject) => {
      try {
        this.Model.findByIdAndUpdate(id, value, { new: true }, (err, data) => {
          if (err) return reject(err)
          resolve(data)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  findById (_id) {
    return this.Model.findById(_id).exec()
  }
}
