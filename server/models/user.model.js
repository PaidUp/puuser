import CommonModel from './common.model'

const address = {
  type: { type: String, required: true },
  label: { type: String, required: true },
  address1: { type: String, required: true },
  address2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  zipCode: { type: String, required: true }
}

const contact = {
  label: { type: String, required: true },
  type: { type: String, required: true },
  value: { type: String, required: true }
}

const permission = {
  key: { type: String, required: true },
  grant: { type: Boolean, required: true }
}

const verify = {
  token: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
  status: { type: String, required: true }
}

const resetPassword = {
  status: { type: String, required: true },
  token: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
}

const schema = {
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date },
  createdBy: String,
  createAt: { type: Date, default: new Date() },
  updateAt: { type: Date, default: new Date() },
  email: { type: String, lowercase: true },
  verify: { type: verify },
  resetPassword: { type: resetPassword },
  roles: { type: Array, default: ['user'] },
  hashedPassword: { type: String },
  salt: { type: String },
  facebook: { id: String, email: String },
  contacts: { type: [contact], default: [] },
  addresses: { type: [address], default: [] },
  teams: [String],
  meta: {
    TDPaymentId: { type: String, default: '' }
  },
  permissions: { type: permission, default: [] }
}

export default class OrganizationModel extends CommonModel {
  constructor () {
    super('user', 'users', schema)

    this.schema.path('email').validate(async function (value, respond) {
      try {
        let user = await this.constructor.findOne({ email: value })
        return user === null
      } catch (error) {
        return false
      }
    }, 'The specified email address is already in use.')
  }
}
