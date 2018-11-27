import CommonModel from './common.model'

const contact = {
  label: { type: String, enum: ['work', 'home'], default: 'home' },
  phone: { type: String, required: true },
  address1: { type: String },
  address2: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String, default: [ 'USA' ] },
  zipCode: { type: String }
}

const verify = {
  token: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
  status: { type: String, required: true }
}

const resetPassword = {
  token: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
  status: { type: String, required: true }
}

const schema = {
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date },
  email: { type: String, lowercase: true, required: true },
  hashedPassword: { type: String },
  salt: { type: String },
  type: { type: String, required: true, enum: [ 'customer', 'functionary', 'organization', 'api', 'service' ] },
  facebookId: { type: String },
  organizationId: { type: String },
  externalCustomerId: { type: String },
  phone: { type: String },
  contacts: { type: [ contact ], default: [] },
  resetPassword: { type: resetPassword },
  verify: { type: verify },
  roles: { type: [String], default: [ 'parent' ] },
  pendingSignup: { type: Boolean, default: false }
}

export default class OrganizationModel extends CommonModel {
  constructor () {
    super('user', 'users', schema)

    this.schema.path('email').validate(async function (value) {
      try {
        let user = await this.constructor.findOne({ email: new RegExp('^' + value + '$', 'i') })
        return user === null
      } catch (error) {
        return false
      }
    }, 'The specified email address is already in use.')
  }
}
