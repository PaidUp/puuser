process.env.NODE_ENV = 'test'

let common = require('./common')
let server = common.server
let token = common.token
let chai = common.chai
let organizationResults = common.results.organization

it.skip('POST# /login/fb signup like a facebook user', done => {
  chai
    .request(server)
    .post('/api/v1/user/login/fb')
    .send({
      rememberMe: true,
      authResponse: { accessToken: 'EAAIeD1dChesBADmD1D5ZBfYnnfJD8NiZC8lApzcKujVR4Y07ZBspIe7UkseLYYDZC3kLgLZBHvbLe4AZAeb4N4ZC7xKzg8aZAZCDNZCJo5T9oZAmtLmPrTnBkiMIuAssmJXZBfZCk4UwTHoUWr8zzpyxGhA8taSoqD9adtp0HLc8Q2YXWfrZCsTQPGLOMzwGpRZBHiXZAZAkDrxaKEjT5PpWsOVZAxuZCNqkXuJskzdzZB8sLgSndpeECQZDZD' }
    })
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.have.property('user')
      res.body.should.have.property('token')
      res.body.token.should.be.a('string')
      common.results.user.fb = res.body
      done()
    })
})

it.skip('POST# /login/fb fail signup missing access to email', done => {
  chai
    .request(server)
    .post('/api/v1/user/login/fb')
    .send({
      rememberMe: true,
      authResponse: { accessToken: 'EAAIeD1dChesBAPJIZBO9CSZAZCz9rR2ZCSjP2W38otrQ9sF5gzECRtCRvm4LmW54hFrZAwWxIBJLMDAwIWXREZBK1oqmfx3BBtlcCxTkjjTXKFY39Sgiq4tfHb4H7CNfx74tSWmSYhpTV8mdj6GlQ4W7TyG7yOG9ZAdQVfpgLWcsNvMwTFXpYOndytVvOEgbY6vLVqemg4b30eIr5KSH2Jd6JAePYW53KsWw8movzYOVAZDZD' }
    })
    .end((err, res) => {
      res.should.have.status(500)
      res.body.should.have.property('code')
      res.body.should.have.property('message')
      res.body.code.should.be.a('string')
      res.body.message.should.be.a('string')
      res.body.code.should.equal('ValidationError')
      res.body.message.should.equal('Facebook email is required')
      common.results.user.fb = res.body
      done()
    })
})

it('POST# / signup with email success', done => {
  chai
    .request(server)
    .post('/api/v1/user')
    .send(common.request.user.userForm)
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.have.property('token')
      res.body.should.have.property('user')
      res.body.user.should.have.property('_id')
      res.body.user.should.have.property('contacts')
      res.body.user.should.have.property('roles')
      res.body.user.should.have.property('firstName')
      res.body.user.firstName.should.equal('John')
      res.body.user.should.have.property('lastName')
      res.body.user.lastName.should.equal('Doe')
      res.body.user.should.have.property('email')
      res.body.user.email.should.equal(common.request.user.userForm.email)
      res.body.user.should.have.property('type')
      res.body.user.type.should.equal('customer')       
      res.body.user.should.not.have.property('salt')
      res.body.user.should.not.have.property('hashedPassword')
      done()
    })
})

it('POST# / signup with email duplicated', done => {
  chai
    .request(server)
    .post('/api/v1/user')
    .send(common.request.user.userForm)
    .end((err, res) => {
      res.should.have.status(500)
      res.body.should.have.property('errors')
      res.body.errors.should.have.property('email')
      res.body.errors.email.should.have.property('message')
      res.body.errors.email.message.should.equal('The specified email address is already in use.')    
      done()
    })
})

it('POST# /login/email login with email success', done => {
  chai
    .request(server)
    .post('/api/v1/user/login/email')
    .send({
      email: common.request.user.userForm.email,
      password: common.request.user.userForm.password,
      rememberMe: true
    })
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.have.property('token')
      res.body.should.have.property('user')
      res.body.user.should.have.property('_id')
      res.body.user.should.have.property('contacts')
      res.body.user.should.have.property('roles')
      res.body.user.should.have.property('firstName')
      res.body.user.firstName.should.equal('John')
      res.body.user.should.have.property('lastName')
      res.body.user.lastName.should.equal('Doe')
      res.body.user.should.have.property('email')
      res.body.user.email.should.equal(common.request.user.userForm.email)
      res.body.user.should.have.property('type')
      res.body.user.type.should.equal('customer')       
      res.body.user.should.not.have.property('salt')
      res.body.user.should.not.have.property('hashedPassword')   
      common.results = res.body
      done()
    })
})

it('POST# /login/email login with email wrong', done => {
  chai
    .request(server)
    .post('/api/v1/user/login/email')
    .send({
      email: 'testtest@test.com',
      password: common.request.user.userForm.password,
      rememberMe: true
    })
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.have.property('error')
      res.body.error.should.have.property('message')
      res.body.error.message.should.equal('This email is not registered.')
      
      done()
    })
})

it('POST# /login/email login with password wrong', done => {
  chai
    .request(server)
    .post('/api/v1/user/login/email')
    .send({
      email: common.request.user.userForm.email,
      password: 'xxxxxxxxx',
      rememberMe: true
    })
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.have.property('error')
      res.body.error.should.have.property('message')
      res.body.error.message.should.equal('Invalid password.')
      done()
    })
})

it('DELETE# /logout logout', done => {
  chai
    .request(server)
    .delete('/api/v1/user/logout')
    .set({
      Authorization: 'Bearer ' + common.results.token
    })
    .end((err, res) => {
      res.should.have.status(200)
      done()
    })
})
