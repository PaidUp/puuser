import { Types } from 'mongoose'
let ObjectId = Types.ObjectId

export default class CommonService {
  constructor (model) {
    this.model = model
  }
  save (entity) {
    return this.model.save(entity).then(entity => entity)
  }

  updateById (id, values) {
    return this.model.updateById(id, values).then(entity => entity)
  }

  getById (entityId) {
    return this.model.findById(entityId).then(entity => entity)
  }

  find (filter) {
    return this.model.find(filter).then(entities => entities)
  }

  findOne (filter) {
    return this.model.findOne(filter).then(entity => entity)
  }

  search (criteria) {
    return this.model.search(criteria).then(entities => entities)
  }

  findOneAndUpdate (query, values) {
    return this.model.findOneAndUpdate(query, values).then(doc => doc)
  }

  getByIdAndFilter (id, values) {
    values._id = new ObjectId(id)
    return this.model.findOne(values).then(entity => entity)
  }
}
