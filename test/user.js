process.env.NODE_ENV = 'test'

let common = require('./common')
let server = common.server
let token = common.token
let chai = common.chai
let organizationResults = common.results.organization

it('POST# /login/fb signup like a facebook user', done => {
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

it('POST# /login/fb fail signup missing access to email', done => {
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

it.skip('GET# /:organizationId it should retrieve an organization', done => {
  chai
    .request(server)
    .get('/api/v1/organization/' + organizationResults.organizationId)
    .set('authorization', token)
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.have.property('_id')
      res.body._id.should.be.a('string')
      organizationResults.document = res.body
      done()
    })
})

it.skip('PUT# /:organizationId/payment/:paymentId it should update payment id an organization', done => {
  chai
    .request(server)
    .put('/api/v1/organization/' + organizationResults.organizationId + '/payment/paymentIdTest')
    .set('authorization', token)
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.have.property('paymentId')
      res.body.paymentId.should.be.a('string')
      res.body.paymentId.should.equal('paymentIdTest')

      res.body.should.have.property('verify')
      res.body.verify.should.be.a('string')
      res.body.verify.should.equal('done')

      res.body.should.have.property('ownerSSN')
      res.body.ownerSSN.should.be.a('string')
      res.body.ownerSSN.should.equal('')

      res.body.should.have.property('aba')
      res.body.aba.should.be.a('string')
      res.body.aba.should.equal('')

      res.body.should.have.property('dda')
      res.body.dda.should.be.a('string')
      res.body.dda.should.equal('')
      done()
    })
})

it.skip('PUT# /:organizationId it should update an organization', done => {
  chai
    .request(server)
    .put('/api/v1/organization/' + organizationResults.organizationId)
    .set('authorization', token)
    .send({website: 'http://teamtest.com'})
    .end((err, res) => {
      res.should.have.status(200)
      res.body.should.have.property('website')
      res.body.website.should.be.a('string')
      res.body.website.should.equal('http://teamtest.com')

      res.body.should.have.property('verify')
      res.body.verify.should.be.a('string')
      res.body.verify.should.equal('done')
      done()
    })
})