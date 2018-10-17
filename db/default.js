const db = 0

db.pu_user_users.createIndex({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  externalCustomerId: 'text',
  phone: 'text'
},
{
  name: 'text-search'
})

db.pu_user_users.createIndex({
  email: 1
},
{
  unique: true,
  name: 'email'
})
