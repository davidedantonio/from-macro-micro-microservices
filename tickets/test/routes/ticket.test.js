'use strict'

const { testWithLogin } = require('../helper')

const fakeTicket = {
  subject: 'A subject',
  body: 'A ticket body'
}

testWithLogin('Create a new ticket', async (t, inject) => {
  const res = await inject({
    url: '/',
    method: 'POST',
    body: fakeTicket
  })

  t.equal(res.statusCode, 200)
  const body = JSON.parse(res.body)
  t.ok(body._id)
})

testWithLogin('Create and get ticket', async (t, inject) => {
  let res = await inject({
    url: '/',
    method: 'POST',
    body: fakeTicket
  })

  t.equal(res.statusCode, 200)
  const body = JSON.parse(res.body)

  res = await inject({
    url: `/${body._id}`,
    method: 'GET'
  })

  t.equal(res.statusCode, 200)
  const body2 = JSON.parse(res.body)
  t.same(body, body2)
})

testWithLogin('Invalid Ticket', async (t, inject) => {
  let res = await inject({
    url: '/123456789011',
    method: 'GET'
  })

  t.equal(res.statusCode, 404)
  t.same(JSON.parse(res.body), { message: 'No ticket found with id 123456789011' })

  res = await inject({
    url: '/123456789011',
    method: 'DELETE'
  })

  t.equal(res.statusCode, 404)
  t.same(JSON.parse(res.body), { message: 'No ticket found with id 123456789011' })

  res = await inject({
    url: '/invalidIdentifier',
    method: 'GET'
  })

  t.equal(res.statusCode, 500)
  t.same(JSON.parse(res.body), { message: 'Argument passed in must be a string of 12 bytes or a string of 24 hex characters' })
})

testWithLogin('Create and delete user', async (t, inject) => {
  let res = await inject({
    url: '/',
    method: 'POST',
    body: fakeTicket
  })

  const body = JSON.parse(res.body)
  res = await inject({
    url: `/${body._id}`,
    method: 'DELETE'
  })

  t.equal(res.statusCode, 204)
})

testWithLogin('Create users and get all', async (t, inject) => {
  await inject({
    url: '/',
    method: 'POST',
    body: fakeTicket
  })

  await inject({
    url: '/',
    method: 'POST',
    body: fakeTicket
  })

  const res = await inject({
    url: '/',
    method: 'GET'
  })
  const body = JSON.parse(res.body)

  t.equal(res.statusCode, 200)
  t.equal(body.length, 2)
})
